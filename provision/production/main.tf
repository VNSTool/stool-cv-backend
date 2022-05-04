provider "aws" {
  region = local.region
  version = "3.59.0"
  # For local env only
  # shared_credentials_file = "/tmp/.aws/credentials"
  # profile                 = "mfa"
}

terraform {
  backend "s3" {
    bucket               = "stool-states-terraform"
    region               = "ap-southeast-1"
    acl                  = "private"
    # For local env only
    # shared_credentials_file = "/tmp/.aws/credentials"
    # profile                 = "mfa"
  }
}

###########################################################################
## Public subnets in zone A and zone B
###########################################################################
resource "aws_route_table" "external" {
  vpc_id = local.vpc_id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = local.igw_id
  }
  tags = local.common_tags
}

resource "aws_subnet" "ec2_subnet_a_graphql" {
  vpc_id = local.vpc_id
  cidr_block = local.public_cidr_block_a
  availability_zone = "ap-southeast-1a"
  tags = merge(
    local.common_tags,
    map(
      "Name", "${local.resource_name}-ec2-subnet-a"
    )
  )
}

resource "aws_route_table_association" "shared_routing_table_with_public_subnet_a" {
  subnet_id      = aws_subnet.ec2_subnet_a_graphql.id
  route_table_id = aws_route_table.external.id
}

resource "aws_subnet" "ec2_subnet_b_graphql" {
  vpc_id = local.vpc_id
  cidr_block = local.public_cidr_block_b
  availability_zone = "ap-southeast-1b"
  tags = merge(
    local.common_tags,
    map(
      "Name", "${local.resource_name}-ec2-subnet-b"
    )
  )
}

resource "aws_route_table_association" "shared_routing_table_with_public_subnet_b" {
  subnet_id      = aws_subnet.ec2_subnet_b_graphql.id
  route_table_id = aws_route_table.external.id
}

###########################################################################
## Security groups
###########################################################################

module "ec2_security_group" {
  source                        = "terraform-aws-modules/security-group/aws"
  version                       = "v3.1.0"
  name                          = "${local.resource_name}-ec2"
  vpc_id                        = local.vpc_id

// to check again
  ingress_with_cidr_blocks      = [
    {
      rule        = "ssh-tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      rule        = "http-80-tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      rule        = "https-443-tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  egress_rules                  = ["all-all"]

  tags = merge(
    local.common_tags,
    map(
      "Name", "${local.resource_name}-ec2"
    )
  )
}

###########################################################################
## Autoscaling Group
###########################################################################

data "aws_route53_zone" "stool_zone" {
  name = "stool.vn"
}

data "aws_ami" "linux" {
  most_recent = true
  filter {
    name = "name"

    values = ["stool-amazon-linux-docker-v0.4"]
  }

  filter {
    name = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["132344050580"]
}

data "template_file" "user_data" {
  template = file("deployment/user-data.sh")
  vars = {
    REGISTRY = var.registry
    IMAGE_TAG = "${var.app_version}-${local.app_env}"
    APP_VERSION = var.app_version
    HOSTED_ZONE_ID = data.aws_route53_zone.stool_zone.zone_id
    AWS_REGION = local.region
  }
}

resource "aws_launch_configuration" "launch_configuration" {
  image_id = data.aws_ami.linux.id
  instance_type = local.instance_type
  spot_price = local.spot_price

  security_groups = [
    module.ec2_security_group.this_security_group_id
  ]
  user_data = data.template_file.user_data.rendered
  key_name = local.key_name
  iam_instance_profile = local.ec2_role
  associate_public_ip_address = true

  root_block_device {
    volume_type = "gp2"
    volume_size = 8
  }

  lifecycle {
    create_before_destroy  = true
  }
}

resource "aws_autoscaling_group" "asg"{
  name                          = local.resource_name
  launch_configuration          = aws_launch_configuration.launch_configuration.name
  vpc_zone_identifier           = [
    aws_subnet.ec2_subnet_a_graphql.id,
    aws_subnet.ec2_subnet_b_graphql.id
  ]
  min_size                      = local.min_size
  max_size                      = local.max_size
  desired_capacity              = local.min_size
  wait_for_capacity_timeout     = "10m"
  health_check_grace_period     = 180
  health_check_type             = "EC2"
  tags                          = [
    {
      key                   = "Env"
      value                 = local.app_env
      propagate_at_launch   = true
    },
    {
      key                   = "App"
      value                 = local.app_name
      propagate_at_launch   = true
    },
    {
      key                   = "Name"
      value                 = local.resource_name
      propagate_at_launch   = true
    },
  ]
  lifecycle {
    create_before_destroy = true
  }
}

locals {
  resource_name = "stool-${local.app_env}-${local.app_name}-${var.app_version}"
  common_tags = {
    App       = local.app_name
    Env       = local.app_env
    Name      = local.resource_name
    ManagedBy = "terraform"
    Workload  = "internal-tools"
  }

  app_name                    = "curriculum-vitae-backend"
  app_env                     = "production"

  region                      = "ap-southeast-1"
  vpc_id                      = "vpc-0b742dfb99075351d"
  igw_id                      = "igw-08e7b639ca2eca03d"
  key_name                    = "stool-prod-2022"

  public_cidr_block_a         = "10.0.0.32/28"
  public_cidr_block_b         = "10.0.0.48/28"

  instance_type               = "t3a.nano"
  spot_price                  = "0.01"
  ec2_role                    = "stool-ec2-curriculum-vitae-production"
  min_size                    = 1
  max_size                    = 1
  
}

import { QueueMessageDto } from '~/modules/shared/dtos/queue-message.dto';
import { CreateJobDto } from './create-job.dto';

export class NotificationDto extends QueueMessageDto {
  body: CreateJobDto;
}

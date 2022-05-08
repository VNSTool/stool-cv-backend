export interface IQueueService {
  queue_type: string;

  sendMessage(queue: string, message: any, group: string);
}

export const QueueService = 'QUEUE_SERVICE';

export interface IQueueService {
  queue_type: string;

  push(path: Object);
}

export const QueueService = 'QUEUE_SERVICE';

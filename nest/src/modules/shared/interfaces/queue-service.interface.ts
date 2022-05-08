export interface IQueueService {
  queue_type: string;

  sendMessage(queue: string, message: any, type: string);
  receiveMessage(queue: string);
}

export const QueueService = 'QUEUE_SERVICE';

export interface IQueueService {
  queue_type: string;

  sendMessage(queue: string, message: any, types: string[]);
  receiveMessage(queue: string);
  deleteMessage(queue: string, key: string): Promise<void>;
}

export const QueueService = 'QUEUE_SERVICE';

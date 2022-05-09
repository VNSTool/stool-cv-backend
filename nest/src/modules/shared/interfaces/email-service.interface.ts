export interface IEmailService {
  email_type: string;

  sendEmail();
}

export const EmailService = 'EMAIL_SERVICE';

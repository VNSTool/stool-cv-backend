export interface IEmailService {
  email_type: string;

  sendEmail(
    toAddresses: string[],
    bccAddresses: string[],
    subject: string,
    body: string,
  );
}

export const EmailService = 'EMAIL_SERVICE';

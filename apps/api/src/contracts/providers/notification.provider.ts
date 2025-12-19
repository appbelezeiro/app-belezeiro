export interface PushNotification {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface SmsNotification {
  phone: string;
  message: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
}

export interface NotificationProvider {
  /**
   * Envia uma notificação push
   */
  sendPush(notification: PushNotification): Promise<void>;

  /**
   * Envia um SMS
   */
  sendSms(notification: SmsNotification): Promise<void>;

  /**
   * Envia um email
   */
  sendEmail(notification: EmailNotification): Promise<void>;
}

export const NOTIFICATION_PROVIDER = Symbol('NotificationProvider');

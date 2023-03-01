import transporter from '../config/transporter.config';
import config from '../index';

const mailHelper =async (options) => {
    const message = {
        from: config.SMTP_MAIL_SENDER_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.text,
        // html: "<b>Hello World!!</b>",
    }
    await transporter.sendMail(message);
}

export default mailHelper;
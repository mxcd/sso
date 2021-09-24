const nodemailer = require("nodemailer");
require('dotenv').config()
const ejs = require('ejs');
const fs = require('fs');

const registrationMailHtmlTemplate = fs.readFileSync('./src/mail-templates/registration-mail-html.ejs', 'utf8');

type SendMailOptions = {
    receipients: string,
    subject: string,
    text: string,
    html: string
}

/*type RegistrationMailOptions = {
    user: User
}*/

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "465"),
    secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export async function sendRegistrationMail(options) {
    const validationLink = `${process.env.ISSUER_URL}/validate?uid=${options.user.id}&code=${options.user.validationCode}`;
    const html = ejs.render(registrationMailHtmlTemplate, {validationLink});

    await sendMail({
        receipients: options.user.email,
        subject: process.env.MAIL_REGISTRATION_SUBJECT || 'Registration',
        text: validationLink,
        html
    })
}

async function sendMail(options: SendMailOptions) {
    let info = await transporter.sendMail({
        from: process.env.MAIL_FROM_LINE,
        to: options.receipients,
        subject: options.subject,
        text: options.text,
        html: options.html,
    });

    console.dir(info)
}

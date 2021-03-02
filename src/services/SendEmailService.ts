import nodemailer, { Transporter } from "nodemailer";
import { resolve } from "path";
import fs from 'fs';
import handlebars from "handlebars";


class SendEmailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            });
            this.client = transporter;
        });
    }

    async execute(name: string, to: string, subject: string, body: string) {

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsEmail.hbs");
        const templateFileContent = fs.readFileSync(npsPath).toString("utf-8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse({
            name: name,
            title: subject,
            description: body
        });

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>",
        });
        console.log("Mensagem Enviada: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export default new SendEmailService();
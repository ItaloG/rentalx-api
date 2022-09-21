import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../IMailProvider";
import Handlebars from "handlebars";
import fs from "fs";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = Handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentex.com.br>",
      subject,
      html: templateHTML,
    });
  }
}

export { EtherealMailProvider };

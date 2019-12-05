import {Request, Response} from "express-serve-static-core"
import nodeEmail           from "nodemailer";
import dotEnv              from "dotenv";
import generatePassword    from "generate-password"
import database            from "../database";
import {MysqlError}        from "mysql";

dotEnv.config();

export default (req: Request, res: Response) => {
    const {email} = req.body;

    database.query(`select * from Users
                                  where email = '${email}'`,
        (err: MysqlError, result: any) => {
            if (err) console.error(err);

            if (result[0]) {
                const newPassword = generatePassword.generate({
                    length: 8,
                    numbers: true,
                    uppercase: true
                });

                database.query(`update Users
                                              set password = '${newPassword}'
                                            where email = '${email}'`,
                    (error: MysqlError, r: any) => {
                        if (error) console.error(error);

                        console.log(r);
                        sendPassword(res, email, newPassword);
                    });
            } else {
                res.redirect('/');
            }
        });

}

const sendPassword = (res: Response, email: string, newPassword: string) => {
    const transporter = nodeEmail.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Tweeter',
        to: email,
        subject: 'Reset password to your account in Tweeter',
        text: 'This is your new password for account ' + newPassword,
        html: html_text(newPassword)
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/');
        }
    });
};

const html_text = (new_password: string) => {
    return `<h1>HI</h1>
<p>This is your new password: ${new_password}</p>
<p>To log in your account use your new password</p>`;
}

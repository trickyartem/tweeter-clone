import {Request, Response} from "express-serve-static-core";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            res.render('form-template.ejs', {
                _route: '/edit',
                fields: [
                    ['Email', 'email', 'email'],
                    ['Nickname', 'text', 'nickname'],
                    ['Status', 'text', 'status'],
                    ['Gender', 'text', 'gender']
                ]
            }, ((err: Error, html: string) => {
                if (err) console.error(err.message);
                writeHTMLFile(res, html);
            }));
        } else {
            res.redirect('/');
        }
    }
}

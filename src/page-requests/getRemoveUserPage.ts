import {Request, Response} from "express-serve-static-core";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            res.render('form-template.ejs', {
                _route: '/remove-user',
                fields: [
                    ['Password', 'password', 'password']
                ]
            }, (err: Error, html: string) => {
                if (err) throw err;

                writeHTMLFile(res, html);
            })
        }
    }
}

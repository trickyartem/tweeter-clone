import {Request, Response} from "express-serve-static-core";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    res.render('form-template.ejs', {
        _route: '/login',
        fields: [
            ['Email', 'email', 'email'],
            ['Password', 'password', 'password']
        ]
    }, (err: Error, html: string) => {
        if (err) throw err;
        writeHTMLFile(res, html);
    });
}

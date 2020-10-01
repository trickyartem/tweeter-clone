import {Request, Response} from "express-serve-static-core";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    res.render('form-template.ejs', {
        _route: '/register',
        fields: [
            ['Email', 'email', 'email'],
            ['Password', 'password', 'password'],
            ['Nickname', 'text', 'nickname'],
            ['Status', 'text', 'status'],
            ['Gender', 'text', 'gender'],
            ['Age', 'number', 'age'],
            ['Profile photo', 'file', "photo"]
        ]
    }, (err: Error, html: string) => {
        if (err) throw err;

        writeHTMLFile(res, html);
    });
}

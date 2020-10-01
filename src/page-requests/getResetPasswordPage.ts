import {Response, Request} from 'express-serve-static-core';
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    res.render('form-template.ejs', {
        _route: '/reset-password',
        fields: [
            ['Email', 'email', 'email']
        ]
    }, ((err: Error, html: string) => {
        if (err) console.error(err.message);

        writeHTMLFile(res, html);
    }))
}

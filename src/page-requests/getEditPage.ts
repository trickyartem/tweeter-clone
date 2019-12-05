import {Request, Response} from "express-serve-static-core";

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
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                res.end();
            }));
        } else {
            res.redirect('/');
        }
    }
}

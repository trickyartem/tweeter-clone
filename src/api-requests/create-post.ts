import {Request, Response} from "express-serve-static-core";

export default (req: Request, res: Response) => {

    // @ts-ignore
    if (req.session.email) {
        res.render('form-template.ejs', {
            _route: '/post-post',
            fields: [
                ['Title', 'text', 'title'],
                ['Text of the post', 'text', 'text']
            ]
        }, ((err: Error, html: string) => {
            if (err) throw new Error(err.message);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }));
    } else {
        res.redirect('/');
    }
}

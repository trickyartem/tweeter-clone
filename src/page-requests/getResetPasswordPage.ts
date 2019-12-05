import {Response, Request} from 'express-serve-static-core';

export default (req: Request, res: Response) => {
    res.render('form-template.ejs', {
        _route: '/reset-password',
        fields: [
            ['Email', 'email', 'email']
        ]
    }, ((err: Error, html: string) => {
        if (err) console.error(err.message);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    }))
}

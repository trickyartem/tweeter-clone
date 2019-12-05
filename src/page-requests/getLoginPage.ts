import {Request, Response} from "express-serve-static-core";

export default (req: Request, res: Response) => {
    res.render('form-template.ejs', {
        _route: '/login',
        fields: [
            ['Email', 'email', 'email'],
            ['Password', 'password', 'password']
        ]
    }, (err: Error, result: string) => {
        if (err) throw err;

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(result);
        res.end();
    });
}

import {Request, Response} from "express-serve-static-core"
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session && req.session.email) {
        const {name} = req.body;

        database.query(`select * from Users
                                    where name like '%${name}%'`,
            (error: MysqlError, users: any) => {
                res.render('find-page.ejs', {
                    users
                }, (err: Error, html: string) => {
                    if (err) console.error(err);

                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();
                });
            })
    } else {
        res.redirect('/');
    }
}



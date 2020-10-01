import {Request, Response} from "express-serve-static-core"
import database            from "../database";
import {MysqlError}        from "mysql";
import {writeHTMLFile} from "../utils";

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
                    writeHTMLFile(res, html);
                });
            })
    } else {
        res.redirect('/');
    }
}



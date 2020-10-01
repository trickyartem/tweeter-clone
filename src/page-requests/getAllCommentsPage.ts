import {Response, Request} from 'express-serve-static-core';
import database from "../database";
import {MysqlError} from "mysql";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {

    if (req.session && req.session.email) {
        const {id} = req.params;

        database.query(`select * from Comments
                                where post_id = ${id}`,
            (err: MysqlError, comments: any) => {
                if (err) console.error(err);
                res.render('all-comments.ejs', {
                    comments
                }, (error: Error, html: string) => {
                    writeHTMLFile(res, html);
                })
            });
    }
};

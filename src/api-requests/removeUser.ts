import {Request, Response} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {password} = req.body;
            const {userId} = req.session;

            database.query(`select password from Users
                                         where User_PK = ${userId}`,
                (err: MysqlError, result: any) => {
                    if (err) console.error(err);

                    if (result[0]) {
                        if (result[0].password === password) {
                            database.query(`delete
                                            from LikedPosts
                                            where user_id = ${userId};`,
                                (err: MysqlError) => {
                                    if (err) console.error(err)
                                });
                            database.query(`delete from Users where User_PK = ${userId}`,
                                (err: MysqlError) => {
                                    if (err) console.error(err)
                                });
                            database.query(`delete from Posts where user_id = ${userId}`,
                                (err: MysqlError) => {
                                    if (err) console.error(err)
                                });
                            res.redirect('/');
                        } else {
                            res.redirect('/profile-page');
                        }
                    } else {
                        res.redirect('/profile-page');
                    }
                });
        }
    }
}

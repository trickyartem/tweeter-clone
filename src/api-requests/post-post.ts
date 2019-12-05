import {Request, Response} from "express-serve-static-core";
import database          from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    const {title, text} = req.body;
    const likes = 0;

    if (req.session) {
        if (req.session.email) {
            const {nickname, userId} = req.session;

            database.query(`insert into Posts(title, text, author, time, likes, user_id)
                                  values ("${title}", "${text}", "${nickname}", current_date(), ${likes}, ${userId})`,
                (err: MysqlError) => {
                    if (err) console.error(err);

                    database.query(`select * from Posts
                                          where user_id = ${userId}`,
                        (err: MysqlError, posts: any) => {
                            if (err) console.error(err);

                            for (let post of posts) {
                                post.comments = []
                            }

                            if (req.session) {
                                req.session.posts = posts;
                            }

                            res.redirect( '/profile-page');
                        });

                });
        } else {
            res.redirect('/')
        }

    }
}

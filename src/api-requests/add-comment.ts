import {Request, Response} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {userId} = req.session;
            const {postId, comment} = req.body;

            database.query(`select name from Users
                                    where User_PK = ${userId}`,
                (err: MysqlError, r: any) => {
                    if (err) console.error(err);

                    const name = r[0].name;

                    database.query(`insert into Comments(text, user_id, post_id, author)
                                            values('${comment}', ${userId}, ${postId}, '${name}')`,
                        (error: MysqlError) => {
                            if (error) console.error(error);

                            database.query(`select * from Comments`,
                                (err1: MysqlError, comments: any) => {
                                    if (err1) console.error(err1);

                                    if (req.session) {
                                        const posts = req.session.posts;

                                        let commentsLength = 0;

                                        if (comments.length >= 2) {
                                            commentsLength = 2
                                        } else if (comments.length === 1) {
                                            commentsLength = 1
                                        }

                                        for (let i = 0; i < posts.length; i++) {
                                            posts[i].comments = [];
                                            for (let j = 0; j < commentsLength; j++) {
                                                if (posts[i].post_id === comments[j].post_id) {
                                                    posts[i].comments.push(comments[j])
                                                }

                                            }
                                            req.session.posts = posts;
                                        }
                                        const response = `<div class="border border-primary shadow p-3 mr-2 ml-2 mb-5 bg-white rounded"><p>${comment}</p><small>posted by ${name}</small></div>`;
                                        res.json({
                                            result: true,
                                            comment: response
                                        })
                                    }
                                });
                        })
                });
        } else {
            res.redirect('/')
        }
    }
}

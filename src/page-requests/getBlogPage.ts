import {Request, Response} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {userId} = req.session    ;
            database.query(`select *
                            from Posts`,
                (err: MysqlError, posts: any) => {
                    if (err) console.error(err.message);

                    database.query(`select *
                                    from Comments`,
                        ((err1: MysqlError, comments: any) => {
                            if (err1) console.error(err1);

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
                            }

                            if (req.session) {
                                req.session.posts = posts;
                            }

                            res.render('blog.ejs', {
                                posts, userId
                            }, (err: Error, html: string) => {
                                res.writeHead(200, {'Content-Type': 'text/html'});
                                res.write(html);
                                res.end();
                            })
                        }))
                });
        } else {
            res.redirect('/')
        }
    }
}

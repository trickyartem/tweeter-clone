import {Request, Response} from "express-serve-static-core"
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {id} = req.params;

            console.log(req.params);
            if (!id.includes('.png')) {
                database.query(`select * from Users
                                    where Users.User_PK = ${id}`,
                    (err: MysqlError, user: any) => {
                        if (err) console.error(err);

                        database.query(`select * from Posts
                                                    where Posts.user_id = ${id}`,
                            (err1: MysqlError, posts: any) => {
                                if (err1) console.error(err1);

                                database.query(`select *
                                                from Comments`,
                                    ((err2: MysqlError, comments: any) => {
                                        if (err2) console.error(err2);

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
                                        // @ts-ignore
                                        req.session.posts = posts;
                                        if (!user[0] && !posts[0]) {
                                            res.redirect('/get-news-feed');
                                        } else {
                                            const {name, status, gender, totalLikes, profilePhoto} = user[0];
                                            console.log(profilePhoto);
                                            res.render('another-profile.ejs', {
                                                name, status, gender, posts, likes: totalLikes, profilePhoto
                                            }, (error: Error, html: string) => {
                                                if (error) console.error(error);

                                                res.writeHead(200, {'Content-Type': 'text/html'});
                                                res.write(html);
                                                res.end();
                                            });
                                        }
                                    }))

                            })
                    });
            } else {
                res.redirect('/');
            }
        }
    }
}

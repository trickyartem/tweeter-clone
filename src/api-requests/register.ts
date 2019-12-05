import {Request, Response} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";
import path                from "path";

export default (req: Request, res: Response) => {
    const {email, password, nickname, status, gender, age} = req.body;

    database.query(`select * from Users
                                     where email = '${email}' OR
                                        name = "${nickname}";`,
        (err: MysqlError, result: any) => {
            if (err) throw err;

            if (result[0] || age < 18) {
                res.redirect('/register-page');
            } else {
                database.query(`insert into Users(email, name, password, status, gender, totalLikes, profilePhoto)
                       values('${email}', "${nickname}", '${password}', '${status}', '${gender}', 0, '${req.file.filename}')`,
                    (error: MysqlError, result: any) => {
                        if (error) throw error;
                        if (req.session) {
                            req.session.email = email;
                            req.session.password = password;
                            req.session.nickname = nickname;
                            req.session.status = status;
                            req.session.gender = gender;
                            req.session.userId = result.insertId;
                            req.session.posts = [];
                            req.session.totalLikes = 0;
                            req.session.comments = [];
                            req.session.profilePhoto = req.file.filename;
                        }
                        res.redirect( '/profile-page');
                    });
            }
        });
}

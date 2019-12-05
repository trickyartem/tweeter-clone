import {Response, Request} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {email, nickname, status, gender} = req.body;
            const {userId} = req.session;

            let _email = email;
            let _nickname = nickname;
            let _status = status;
            let _gender = gender;
            if (!email || email.length <= 3) {
                _email = req.session.email;
            }
            if (!nickname || nickname.length <= 3) {
                _nickname = req.session.nickname;
            }
            if (!gender || gender.length <= 3) {
                _gender = req.session.gender;
            }

            database.query(`update Posts, Users
                    inner join Posts P on Users.User_PK = P.user_id
                                          set P.author = '${_nickname}',
                                                Users.email = '${_email}',
                                               Users.name = '${_nickname}',
                                               Users.status = '${_status}',
                                               Users.gender = '${_gender}'
                                          where Users.User_PK = ${userId} and 
                                                P.user_id = ${userId}`,
                (err: MysqlError) => {
                    if (err) console.error(err);

                    res.redirect('/profile-page');
                });
        } else {
            res.redirect('/')
        }
    }
}

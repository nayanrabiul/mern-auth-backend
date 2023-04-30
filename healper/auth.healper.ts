import jwt, {Secret} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {aws4} from "mongodb/src/deps";
import User from "../routes/user/user.model";
import {inflate} from "zlib";

const secret: Secret = process.env.SECRET as Secret;
export const decodeToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (req.headers?.authorization === undefined) {
            return next();
        } else {
            const token = req.headers?.authorization?.split(' ')[1];
            if (secret) {
                const decodedToken = jwt.verify(token, secret);
                if (typeof decodedToken === 'object') {
                    res.locals.user = decodedToken;
                }
            }
            next();
        }
    } catch (err) {
        next();
    }
};

type decodedToken = {
    _id: string;
    role: string;
    email: string;
}

export const auth = ({
                         isAdmin = false,
                         isUser = false,
                         isAuth = false
                     }) => (req: Request, res: Response, next: NextFunction): void => {

    const token = req.headers?.authorization?.split(' ')[1];
    console.log(token);
    if (!!token) {
        try {
            const decodedToken: decodedToken = jwt.verify(token, secret) as decodedToken;
            console.log(decodedToken);

            if (isAdmin && decodedToken.role === 'admin') {
                User.findOne({_id: decodedToken._id}).then((user) => {
                        if (user) {
                            res.locals.user = user
                            next()
                        } else {
                            res.status(401).send({
                                error: true,
                                msg: 'User not found'
                            })
                        }
                    }
                )
            } else if (isUser && decodedToken.role === 'user') {
                User.findOne({_id: decodedToken._id}).then((user) => {
                        if (user) {
                            res.locals.user = user
                            next()
                        } else {
                            res.status(401).send({
                                error: true,
                                msg: 'User not found'
                            })
                        }
                    }
                )
            } else if (isAuth) {
                User.findOne({_id: decodedToken._id}).then((user) => {
                        if (user) {
                            res.locals.user = user
                            next()
                        } else {
                            res.status(401).send({
                                error: true,
                                msg: 'User not found'
                            })
                        }
                    }
                )
            }
        } catch (e) {
            console.log(e)
            res.status(500).send({
                error: true,
                msg: 'Something went wrong'
            })
        }
    } else {
        res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })
    }
}


// initialize firebase admin sdk
import admin from 'firebase-admin';
import jsonConfig from './logintest-57cf1-firebase-adminsdk-7jdny-2ce43cc408.json'

export const firebaseAdmin = admin.initializeApp({
    //@ts-ignore
    credential: admin.credential.cert(jsonConfig)
});




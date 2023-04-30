import {NextFunction} from "express";
import mongoose from "mongoose";
import {firebaseAdmin} from "../../healper/auth.healper";
import {getAuth} from "firebase-admin/auth";
import User from '../user/user.model'
import {UserType} from '../../healper/types'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {verifyGoogleBodyType} from "../../healper/types";

export const getPofile = async (req, res, next) => {
    try {
        let user: UserType = res.locals.user
        user = await User.findOne({_id: user._id})
        return res.status(200).send({
            error: false,
            data: {
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                role: user.role,
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Profile fetch failed! Try again'
        })
    }
}

export const verifyGoogleUser = async (req, res, next) => {
    try {
        let body: verifyGoogleBodyType = req.body
        //get user from firebase.
        let decodedToken = await getAuth(firebaseAdmin).verifyIdToken(body.access_token)
        //check if idtoken valid
        if (!decodedToken.email) {
            res.status(401).sned({
                error: true,
                msg: 'Wrong Token'
            })
        }
        //else find user from database if user exist
        let user: any = await User.findOne({email: decodedToken?.email})
        //if not found,create user
        if (!user) {
            user = new User({
                name: decodedToken.name,
                email: decodedToken.email?.toLowerCase(),
                photoURL: decodedToken.picture,
                role: 'user',
                auth_type: 'google',
                verified: true
            })
            await user.save();
        }
        //sign jwt
        const secret = process.env.SECRET
        let token = jwt.sign({_id: user?._id, email: user?.email, role: 'user'}, secret, {expiresIn: '8h'})
        return res.status(200).send({
            error: false,
            msg: 'Login successful',
            token,
            data: {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                role: user?.role,
                verified: user?.verified,
                auth_type: user?.auth_type
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Login failed! Try again'
        })
    }
}
export const emailLogin = async (req, res, next) => {
    const {email, password} = req.body
    try {
        if (!!email && !!password) {
            let user: UserType = await User.findOne({email: email})
            if (!!user) {
                const match =  bcrypt.compareSync(password, user.password);
                if (match) {
                    const secret = process.env.SECRET
                    let token = jwt.sign({_id: user?._id, email: user?.email, role: 'user'}, secret, {expiresIn: '8h'})
                    return res.status(200).send({
                        error: false,
                        msg: 'Login successful',
                        token,
                        data: {
                            _id: user?._id,
                            name: user?.name,
                            email: user?.email,
                            phone: user?.phone,
                            role: user?.role,
                            verified: user?.verified,
                            auth_type: user?.auth_type
                        }
                    })
                }
            }
        } else {
            return res.status(401).send({
                error: true,
                msg: 'Wrong password'
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Login failed! Try again'
        })
    }
}
export const register = async (req, res, next) => {
    const {name, email, password} = req.body
    try {
        if (!!email && !!password) {
            let user: UserType = await User.findOne({email: email})
            if (!!user) {
                return res.status(401).send({
                    error: true,
                    msg: 'Email already exist'
                })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                user  = await User.create ({
                    name: name,
                    email: email,
                    password: hash,
                    role: 'user',
                    auth_type: 'email',
                    verified: false
                }) as any

                return res.status(200).send({
                    error: false,
                    msg: 'Registration successful',
                    data: {
                        _id: user?._id,
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                        role: user?.role,
                        verified: user?.verified,
                        auth_type: user?.auth_type
                    }
                })
            }
        } else {
            return res.status(401).send({
                error: true,
                msg: 'Wrong password'
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Registration failed! Try again'
        })
    }
}


import {Router} from 'express'
import {emailLogin, getPofile, register, verifyGoogleUser} from "./user.controler";
import {auth} from "../../healper/auth.healper";

const userRoute = Router()

//signin signup routes
userRoute.post('/get-profile', auth({isAuth: true}), getPofile)
userRoute.post('/verify-google-user', verifyGoogleUser)
userRoute.post('/email-login', emailLogin)
userRoute.post('/email-register', register)
export default userRoute

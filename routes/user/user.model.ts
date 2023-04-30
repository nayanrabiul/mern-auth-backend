import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    photoURL: String,
    auth_type:String,

    password: {
        type: String,
        trim: true
    },
    otp: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

const User = model('user', userSchema);

export default User

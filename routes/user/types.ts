export  interface  UserType {
    _id:string
    name: string;
    email: string;
    phone: string;
    photoURL: string;
    role: 'user' | 'admin' ;
    auth_type:string;
    password: string;
    otp: string;
    verified: boolean;

}

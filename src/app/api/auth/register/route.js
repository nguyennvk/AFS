import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';
import {hash} from 'bcrypt';


const prisma = new PrismaClient();

export async function POST(req){
    try{
        const register = await req.json();
        let email = register.email
        let password = register.password
        email = email.trim();
        password = password.trim();
        
        if (!register.first_name || !register.last_name || !register.phone_number){
            return NextResponse.json({error: "Please provide first_name, last_name, phone_number"}, {status: 400});
        }
        if (!email || !password){
            console.log("no email or password");
            return NextResponse.json({error: "Please provide an email and a password"}, {status: 400});
        } 
        if (!validateEmail(email)){
            console.log("invalid email");
            return NextResponse.json({error: "Please provide a valid email"}, {status: 400});
        }
        if (!validatePassword(password)){
            return NextResponse.json({error: "Password must has length greater than 8 and include a-zA-z0-9 and at least 1 special character"}, {status: 400})
        }

        const hashedPassword = await hash(password, 10);
        const account = await prisma.account.create({
            data: {
                account_email: email,
                account_password: hashedPassword,
                account_first_name: register.first_name,
                account_last_name: register.last_name,
                account_phone_number: register.phone_number
            }
        })

        console.log(account);
        const { password: _, ...safeAccount } = account;

        return NextResponse.json({safeAccount}, {status: 200});


    } catch (error){
        if (error.code === 'P2002'){
            return NextResponse.json({error: "Email or phone number already exists"}, {status: 409});
        }
        // should probably do more error messages here but we'll see what errors we run into
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}

function validateEmail(email){
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)){
        return true;
    } else {
        return false;
    }
}

function validatePassword(password){

    return /[A-Z]/       .test(password) &&
           /[a-z]/       .test(password) &&
           /[0-9]/       .test(password) &&
           /[^A-Za-z0-9]/.test(password) &&
           password.length > 8;

}

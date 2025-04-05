import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';
import {compare} from 'bcrypt';
import { serialize } from "cookie";
import jwt from 'jsonwebtoken';

const Prisma = new PrismaClient();




export async function POST(req){
    try{
        const {email, password} = await req.json();
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string'){
            console.log("no email or password");
            return NextResponse.json({error: "Please provide a valid email/password"}, {status: 400});
        }

        const account = await Prisma.account.findUnique({
            where: {
                account_email: email
            }
        })

        if (!account){
            console.log("invalid email");
            return NextResponse.json({error: "Invalid email. You have not registered"}, {status: 401});
        }

        if (!await compare(password, account.account_password)){
            console.log("incorrect password");
            return NextResponse.json({error: "Incorrect password"}, {status: 401});
        }
        const accessToken = jwt.sign({email: account.account_email, id: account.account_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign({email: account.account_email, id: account.account_id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
        // Store refresh token in an HTTP-only cookie
        const cookie = serialize("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60, // 15 minutes
        });

        return NextResponse.json(
            { success: true , accessToken: accessToken},
            { headers: { "Set-Cookie": cookie } }
        );


        return response;

    } catch (error){
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}


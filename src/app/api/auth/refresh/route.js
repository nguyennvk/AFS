import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';


const Prisma = new PrismaClient();


export async function POST(req){
    try{
        const {refreshToken} = await req.json();
        if (!refreshToken){
            return NextResponse.json({error: "Please provide a refresh token"}, {status: 400});
        }

        const newAccessToken = refreshAccessToken(refreshToken);

        if (!newAccessToken){
            return NextResponse.json({error: "Unauthorized: invalid or expired token"}, {status: 401});
        }
        return NextResponse.json({accessToken: newAccessToken}, {status: 200});

    } catch (error){
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}

function refreshAccessToken(refreshToken){
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({email: decoded.email, id: decoded.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
        return newAccessToken;

    } catch (error){
        return null;
    }
}
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function POST(request, {params}){
    const cookieStore = await cookies(); // Retrieve the cookie store
        const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
        if (!accessToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    const { id } = decoded;
    
    try{
        var notiId = request.nextUrl.searchParams.get('notiId');
    }
    catch{
        return NextResponse.json({error: "Unable to get id or notification id"}, {status: 400})
    }
    
    try{
        const noti = await prisma.notification.update({
            where:
            {
                notification_id: parseInt(notiId),
                account_id: parseInt(id)
            },
            data: {
                notification_read: true
            }
        })
        return NextResponse.json({message: "Notification read"}, {status: 200})
    } catch{
        return NextResponse.json({error: "Bad request, invalid id"}, {status: 400})
    }
}
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import verifyUser from "@/utils/verifyUser"

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function GET(request) {
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const { id } = decoded;
        const userInfo = await prisma.account.findUnique({
            where: {
                account_id: parseInt(id),
            },
            select: {
                account_first_name: true,
                account_last_name: true,
                account_email: true,
                account_phone_number: true,
            },
        });
    
        if (!userInfo) {
            return NextResponse.json({ error: "Bad request, invalid id or id does not exist" }, { status: 400 })
        }
        return NextResponse.json(userInfo, { status: 200 })

    } catch (error) {
        return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

}
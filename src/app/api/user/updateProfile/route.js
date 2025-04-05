import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function PUT(request) {
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const { id } = decoded;
        const body = await request.json();
        const { account_first_name, account_last_name, account_email, account_phone_number } = body;
        const userInfo = await prisma.account.update({
            where: {
                account_id: parseInt(id),
            },
            data: {
                account_first_name: account_first_name,
                account_last_name: account_last_name,
                account_email: account_email,
                account_phone_number: account_phone_number,
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
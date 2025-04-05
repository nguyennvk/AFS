import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {

    
    const cookie = serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Expire the cookie immediately
    });
    console.log(cookie);
    return NextResponse.json(
        { success: true },
        { headers: { "Set-Cookie": cookie } }
    );
}

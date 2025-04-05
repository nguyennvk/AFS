import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

export async function GET(req) {
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
  
  
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        return Response.json({ user: decoded }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}

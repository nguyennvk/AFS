import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET

export default function verifyUser(request){
    const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1]
        console.log(token)
        if (!token){
            return NextResponse.json({ error: "Invalid token format" }, {status: 401});
        } 
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (typeof(decoded.id) !== "number"){
                return NextResponse.json({error: "Unauthorized action"}, {status:401})
            }
            return NextResponse.json({valid: true, id: decoded.id}, {status:200})
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, {status: 403});
          }
}
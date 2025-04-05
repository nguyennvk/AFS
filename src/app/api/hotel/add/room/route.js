import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { error } from "console";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();
export async function POST(request) {
    //Authentication first

    try{
        const formData = await request.formData();
        const room_number = formData.get("room_number");
        const room_type = formData.get("room_type");
        const room_price = parseFloat(formData.get('room_price'));
        const room_amenities = formData.get("room_amenities");
        const room_images = formData.getAll("room_images");
        const hotel_id = parseInt(formData.get("hotel_id"))

        // Verify
        const cookieStore = await cookies(); // Retrieve the cookie store
        const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
        if (!accessToken) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        const { id } = decoded;

        if (room_number && room_type) {
            try {
               
                const dirRoomPath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/rooms/"+room_number);
                try {
                    await fs.access(dirRoomPath);
                } catch {
                    await fs.mkdir(dirRoomPath, { recursive: true }); 
                }
                // populate room images
                const room_images_dir = [];
                if (room_images){
                    for (const i of room_images){
                        // Convert file to buffer
                        const buffer = Buffer.from(await i.arrayBuffer());
        
                        // Generate a unique filename
                        const filename = Date.now() + "_" + i.name.replace(/\s+/g, "_");
            
                        // Define upload path inside /public/uploads
                        const uploadPath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/rooms/"+room_number, filename);
            
                        // Save the file
                        try{
                        await writeFile(uploadPath, buffer);
                        room_images_dir.push("hotel/"+hotel_id+"/rooms/"+room_number+"/"+filename);
                        } catch{
                            return NextResponse.json(
                                {message: "Internal error"},
                                { status : 500}
                            )
                        }
                    }
                }
                const room = await prisma.room.create({
                    data: {
                        room_number: room_number,
                        room_type: room_type,
                        room_price: room_price,
                        room_amenities: room_amenities,
                        room_image_dir: room_images_dir,
                        hotel_id: hotel_id
                    }
                })
                return NextResponse.json(
                    {message: "Successfully add room",
                    info: {room_number: room.room_number, room_type: room.room_type, room_amenities: room.room_amenities}
                    },
                    {status: 201})
            }
            catch{
                return NextResponse.json(
                    { error: "Bad Request" },
                    { status: 400 }
                );
            }
        
        } else {
            console.log("Trace3")
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 }
        );
        }

    }
    catch (error) {
        console.error("Error adding hotel:", error);
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 }
        );
    }
}
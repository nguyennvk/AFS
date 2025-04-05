// Need to talk with the log in sign in to see if this person is eligible to add hotel (check for token)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const prisma = new PrismaClient();

export async function POST(request) {
    // Verify
    const cookieStore = await cookies(); // Retrieve the cookie store
    const accessToken = await cookieStore.get("accessToken")?.value; // Await the cookies store to get the value
    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    try {

        // Parse request body
        const { id } = decoded;
        const formData = await request.formData();
        const name = formData.get("name");
        const street = formData.get("street");
        const city = formData.get("city");
        const country = formData.get("country")
        const logo = formData.get('logo');
        const long = formData.get("long");
        const lat = formData.get("lat");
        const desc = formData.get('description');
        const images = formData.getAll("images");
        // Validate required fields
        if (!id){
            return NextResponse.json(
                {error: "Internal Error"}, { status : 500}
            )
        }
        if (!name || !street || !city || !country || !long || !lat) {
            return NextResponse.json(
                { error: "Hotel name, street, city, country, longtitue, latitute are required" },
                { status: 400 }
            );
        }


        // Save hotel to DB
        try {
            const hotel = await prisma.hotel.create({
                data: {
                    hotel_name: name,
                    hotel_street: street,
                    hotel_city: city,
                    hotel_country: country,
                    hotel_location_long: parseFloat(long),
                    hotel_location_lat: parseFloat(lat),
                    hotel_review_point: 0,
                    hotel_description: desc,
                    hotel_review_num: 0,
                    owner_id: parseInt(id)
                },
            });

         const hotel_id = hotel.hotel_id;
            // Create new dir for logo and images
         const dirLogoPath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/hotelLogo");
         try {
             await fs.access(dirLogoPath);
           } catch {
             await fs.mkdir(dirLogoPath, { recursive: true }); 
         }
         
         const dirImagePath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/hotelImages");
         try {
             await fs.access(dirImagePath);
           } catch {
             await fs.mkdir(dirImagePath, { recursive: true }); 
         }
        let logoPath= "";
        if (logo){
        // Convert file to buffer
        const buffer = Buffer.from(await logo.arrayBuffer());

        // Generate a unique filename
        const filename = Date.now() + "_" + logo.name.replace(/\s+/g, "_");

        // Define upload path inside /public/uploads
        const uploadPath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/hotelLogo/", filename);
        // Save the file   
        await writeFile(uploadPath, buffer);
        logoPath = "hotel/"+hotel_id+"/hotelLogo/"+filename;
        }
        const hotel_images = [];
        if (images){
            for (const i of images){
                // Convert file to buffer
                const buffer = Buffer.from(await i.arrayBuffer());

                // Generate a unique filename
                const filename = Date.now() + "_" + i.name.replace(/\s+/g, "_");
    
                // Define upload path inside /public/uploads
                const uploadPath = path.join(process.cwd(), "public/hotel/"+hotel_id+"/hotelImages/", filename);
                hotel_images.push("hotel/"+hotel_id+"/hotelImages/"+filename);
                // Save the file
                await writeFile(uploadPath, buffer);
            }
        }

        const update_hotel = await prisma.hotel.update({
            data: {
                hotel_logo: logoPath, // Relative path for serving files
                hotel_image_dir: hotel_images, // Relative path for serving files
            },
            where: {
                hotel_id: hotel_id,
            },
        
        });

         return NextResponse.json(
            { message: "Hotel added successfully",
            info: {name: hotel.hotel_name, address: hotel.hotel_street+", "+hotel.hotel_city+", "+hotel.hotel_country,
                location: [hotel.hotel_location_long, hotel.hotel_location_lat],
                description: hotel.description}
            },
            { status: 201 },
        );

        } catch{
            return NextResponse.json(
                {message: "Bad request"},
                {status: 400}
            )
        }
          
    } catch (error) {
        console.error("Error adding hotel:", error);
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 }
        );
    }

  }

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import verifyUser from "@/utils/verifyUser"
const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;

/*
{
    id: 1,
    hotel_id: 1,
    rating: 4.5
}
 */

export async function POST(request){
    
    const review = await request.json()
    if (!review.id || !review.rating){
        return NextResponse.json({error: "Bad request, need to have valid id, hotel_id"}, {status: 400})
    }
    // Verify
    const isValid = verifyUser(review.id, request)
    if (isValid.status>299){
        return isValid
    }
    const check = await isValid.json()
    if (!check.valid){
        return isValid
    }

    const hotel_id = parseInt(review.hotel_id)
    if (!hotel_id){
        return NextResponse.json({message: "Bad request, must include hotel_id"}, {status: 400})
    }

    const rating = parseFloat(review.rating)
    const updatedReview = await prisma.hotel.update({
        where: { hotel_id:  hotel_id}, // Specify the unique identifier of the record
        data: {
            hotel_review_point: {
            increment: 1, // Increment the value of the field by 1
          },
            hotel_review_num: {
                increment: rating,
            },

        },
      });
    return NextResponse.json(updatedReview, {status: 200})
}
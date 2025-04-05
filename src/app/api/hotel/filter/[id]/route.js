import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import verifyUser from "@/utils/verifyUser"

const API_KEY = process.env.API_KEY; // Store securely in .env
const prisma = new PrismaClient();
const BASE_API_URL = process.env.BASE_API_URL;

export async function GET(request, {params}){
    
    try{
        var { id } = await params;
        var hotel_id = parseInt(request.nextUrl.searchParams.get("hotel_id"));
        var room_type = request.nextUrl.searchParams.get('room_type');
        var date = request.nextUrl.searchParams.get('date');
        var operation = request.nextUrl.searchParams.get('operation');
        if (operation && operation !== "AND" && operation !== "OR"){
            return NextResponse.json({error: "Bad request, operation can only be AND/OR"}, {status: 400})
        }
        if(!hotel_id){
            return NextResponse.json({error: "Bad request, need to have hotel_id"}, {status: 400})
        }
        // Verify
        const isValid = verifyUser(id, request)
        if (isValid.status>299){
            return isValid
        }
        const check = await isValid.json()
        if (!check.valid){
            return isValid
        }

    }
    catch{
        return NextResponse.json({error: "Bad request, invalid user id"}, {status: 400})
    }




    const filter = {where: {hotel_id: hotel_id}, select: {}}
    if (operation==="AND"){
        filter.where.AND = {}
        if (room_type && date){
            filter.where.AND.start_date = {lte: new Date(date)}
            filter.where.AND.end_date = {gte: new Date(date)}
            filter.where.AND.room = {room_type: room_type}
        }
    }
    else if (operation==="OR"){
        filter.where.OR = []
        if (room_type && date){
            filter.where.OR.push({AND: {start_date: {lte: new Date(date)}, end_date: {gte: new Date(date)}}})
            filter.where.OR.push({room: {room_type: room_type}})
        }
    }
    else{
        if (room_type){
            filter.where.room = {room_type: room_type}
        }
        if (date){
            filter.where.AND = {start_date: {lte: new Date(date)}, end_date: {gte: new Date(date)}}
        }
    }
    
    
    try{
        filter.select = {
            reservation_id: true,
            hotel_id: true,
            room_number: true,
            customer_id: true,
            start_date: true,
            end_date: true,
            status: true,
            room: {
                select: {
                    room_type: true,
                    room_price: true
                }
            }
        }
        const filtered_reservation = await prisma.reservation.findMany(
            filter
        )
        return NextResponse.json(filtered_reservation, {status: 200})
    } catch{
        return NextResponse.json({error: "Bad request"}, {status: 400})
    }

}
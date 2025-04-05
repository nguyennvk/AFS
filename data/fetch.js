import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
const API_KEY = process.env.API_KEY; // Store securely in .env
const BASE_API_URL = process.env.BASE_API_URL;
try {
    const url = new URL(BASE_API_URL + "/api/cities");

    const response = await fetch(url, {
        method: "GET",
        headers: {
        "x-api-key": API_KEY,
        }
    })
    if (response.status <299){
        const cities = await response.json()
        await prisma.city.createMany({
            data: cities
        })
        console.log("Successfully populate cities")
        }
    else{
        console.log("Something wrong fetching data")
    }
    
} catch (error) {
    console.error("Error fetching citeis:", error);
}

try {
    const url = new URL(BASE_API_URL + "/api/airports");

    const response = await fetch(url, {
        method: "GET",
        headers: {
        "x-api-key": API_KEY,
        }
    })
    if (response.status <299){
        const airports = await response.json()
        await prisma.airport.createMany({
            data: airports
        })
        console.log("Successfully populate airports")
        }
    else{
        console.log("Something wrong fetching data")
    }
    
} catch (error) {
    console.error("Error fetching airports:", error);
}



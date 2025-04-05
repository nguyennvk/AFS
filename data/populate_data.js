import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function populateUsers() {
  try {
    // Read the JSON file
    const filePath = path.join('./data/users.json');
    const rawData = fs.readFileSync(filePath);
    const users = JSON.parse(rawData);

    // Iterate over the users and insert them into the database
    for (const register of users) {
        const hashedPassword = await hash(register.password, 10);
        await prisma.account.create({
            data: {
            account_email: register.email,
            account_password: hashedPassword,
            account_first_name: register.first_name,
            account_last_name: register.last_name,
            account_phone_number: register.phone_number,
            },
        });
    }

    console.log('Users populated successfully!');
  } catch (error) {
    console.error('Error populating users:', error);
  } finally {
    await prisma.$disconnect();
  }
  try {
    // Read the JSON file
    const filePath = path.join('./data/hotels.json');
    const rawData = fs.readFileSync(filePath);
    const hotels = JSON.parse(rawData);

    // Iterate over the users and insert them into the database
    for (const hotel of hotels) {
        await prisma.hotel.create({
            data: {
            hotel_name: hotel.name,
            hotel_street: hotel.street,
            hotel_city: hotel.city,
            hotel_country: hotel.country,
            hotel_location_long: hotel.longitude,
            hotel_location_lat: hotel.latitude,
            hotel_description: hotel.description,
            owner_id: hotel.id,
            hotel_rating: hotel.rating,
            },
        });
    }

    console.log('Hotel populated successfully!');
  } catch (error) {
    console.error('Error populating users:', error);
  } finally {
    await prisma.$disconnect();
  }

  try {
    // Read the JSON file
    const filePath = path.join('./data/hotel_rooms.json');
    const rawData = fs.readFileSync(filePath);
    const rooms = JSON.parse(rawData);

    // Iterate over the users and insert them into the database
    for (const room of rooms) {
        await prisma.room.create({
            data: {
            room_number: room.room_number,
            room_type: room.room_type,
            room_price: room.room_price,
            room_amenities: room.room_amenities,
            hotel_id: room.hotel_id
            }
        });
    }

    console.log('Rooms populated successfully!');
  } catch (error) {
    console.error('Error populating users:', error);
  } finally {
    await prisma.$disconnect();
  }


}

populateUsers();

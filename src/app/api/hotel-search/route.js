import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
// The code in this file is partially AI generated using Claude

// To prevent multiple instances of PrismaClient during development
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

//
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// This is the main function that handles the hotel search
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // All searcg parameters
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const city = searchParams.get('city')?.toLowerCase() || '';
        const name = searchParams.get('name')?.toLowerCase() || '';
        const minRating = searchParams.get('minRating') ? parseInt(searchParams.get('minRating')) : 0;
        const maxRating = searchParams.get('maxRating') ? parseInt(searchParams.get('maxRating')) : 5;
        const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
        const maxPrice = parseFloat(searchParams.get('maxPrice')) || 1000;

        console.log(`Searching for hotels in ${city} with name containing "${name}", rating between ${minRating}-${maxRating}, price between $${minPrice}-$${maxPrice}, check-in: ${checkIn}, check-out: ${checkOut}`);
        // Base query to get hotels
        let hotels = await prisma.hotel.findMany({
            where: {
                AND: [
                    {
                        hotel_city: {
                            contains: city, 
                            mode: "insensitive"
                        }
                    },
                    // name ? {
                    //     hotel_name: {
                    //         contains: name,
                    //         mode: "insensitive"
                    //     }
                    // } : {},
                    {
                        hotel_review_point: {
                            gte: minRating,
                            lte: maxRating
                        }
                    }
                ]
            },
            include: {
                hotel_rooms: true
            }
        });
        console.log(hotels)

        // Transform hotel data to client-friendly format regardless of date filtering
        let transformedHotels = hotels.map(hotel => {
            // Filter rooms by price
            const filteredRooms = hotel.hotel_rooms.filter(room => 
                room.room_price >= minPrice && room.room_price <= maxPrice
            );

            // Calculate starting price if any rooms available
            let startingPrice = null;
            if (filteredRooms.length > 0) {
                startingPrice = Math.min(...filteredRooms.map(room => room.room_price));
            }

            // Ensure images is never undefined, but an object with null properties
            const images = {
                logo: hotel.hotel_logo || null,
                directory: hotel.hotel_image_dir || null
            };

            // Log any issues with image data
            if (!hotel.hotel_logo) {
                console.log(`Warning: Hotel ${hotel.hotel_id} (${hotel.hotel_name}) has no logo image`);
            }

            const hotelInfo = {
                id: hotel.hotel_id,
                name: hotel.hotel_name || 'Unnamed Hotel',
                address: {
                    street: hotel.hotel_street || '',
                    city: hotel.hotel_city || '',
                    country: hotel.hotel_country || ''
                },
                location: {
                    latitude: hotel.hotel_location_lat || 0,
                    longitude: hotel.hotel_location_long || 0
                },
                rating: {
                    points: hotel.hotel_review_point || 0,
                    numberOfReviews: hotel.hotel_review_num || 0
                },
                description: hotel.hotel_description || 'No description available',
                images: images, // Use the guaranteed object
                startingPrice: startingPrice || 0,
                availableRooms: filteredRooms.map(room => ({
                    number: room.room_number || '',
                    type: room.room_type,
                    price: room.room_price || 0,
                    amenities: room.room_amenties ? room.room_amenties.split(',').map(a => a.trim()) : []
                }))
            };
            // console.log(hotelInfo);
            return hotelInfo;
        });

        // Additional date-based filtering if dates are provided
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            // Get all reservations that overlap with requested dates
            const reservations = await prisma.reservation.findMany({
                where: {
                    OR: [
                        {
                            AND: [
                                { start_date: { lte: checkOutDate } },
                                { end_date: { gte: checkInDate } }
                            ]
                        }
                    ]
                }
            });

            // Create a set of reserved room IDs
            const reservedRooms = new Set(
                reservations.map(res => `${res.hotel_id}-${res.room_number}`)
            );

            // Filter hotels based on available rooms after considering reservations
            transformedHotels = transformedHotels.filter(hotel => {
                // We need to get the original hotel to check room numbers
                const originalHotel = hotels.find(h => h.hotel_id === hotel.id);
                if (!originalHotel) return false;

                const availableRooms = originalHotel.hotel_rooms.filter(room => {
                    const isAvailable = !reservedRooms.has(`${originalHotel.hotel_id}-${room.room_number}`);
                    const isInPriceRange = room.room_price >= minPrice && room.room_price <= maxPrice;
                    return isAvailable && isInPriceRange;
                });

                // Update the hotel's available rooms
                hotel.availableRooms = availableRooms.map(room => ({
                    number: room.room_number || '',
                    type: room.room_type || 'Standard',
                    price: room.room_price || 0,
                    amenities: room.room_amenties ? room.room_amenties.split(',').map(a => a.trim()) : []
                }));

                // Update starting price
                if (availableRooms.length > 0) {
                    hotel.startingPrice = Math.min(...availableRooms.map(room => room.room_price));
                } else {
                    hotel.startingPrice = 0;
                }

                return availableRooms.length > 0;
            });
        }

        // Returning the response
        return NextResponse.json({
            success: true,
            data: {
                hotels: transformedHotels,
                totalResults: transformedHotels.length,
                message: transformedHotels.length === 0 ? `No hotels found matching your criteria: ${[
                    city && `in ${city}`,
                    name && `with name containing "${name}"`,
                    `with rating between ${minRating}-${maxRating}`,
                    `with price between $${minPrice}-$${maxPrice}`,
                    checkIn && checkOut && `for dates ${checkIn} to ${checkOut}`
                ].filter(Boolean).join(', ')}` : null,
                searchCriteria: {
                    city,
                    checkIn: checkIn ? new Date(checkIn).toISOString() : null,
                    checkOut: checkOut ? new Date(checkOut).toISOString() : null,
                    priceRange: { min: minPrice, max: maxPrice },
                    averageRating: (minRating + maxRating) / 2
                }
            }
        });

    // Error handling
    } catch (error) {
        console.error('Hotel search error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to search hotels'
        }, { status: 500 });
    }
}

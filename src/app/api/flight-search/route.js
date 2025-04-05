import { NextResponse } from 'next/server';
import { AFS_API_URL, AFS_API_KEY } from '../../config';
// The code in this file is partially AI generated using Claude

// Formatting date for API
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Handling API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  return NextResponse.json(
    { 
      success: false,
      error: 'Failed to fetch flight data', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    },
    { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      } 
    }
  );
};

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Date validation functions
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// const isPastDate = (dateString) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return date < today;
// };

const isValidDateRange = (departureDate, returnDate) => {
  if (!returnDate) return true; // For one-way flights
  const departure = new Date(departureDate);
  const return_ = new Date(returnDate);
  return return_ >= departure;
};

// City search API with autocomplete
export async function GET(request) {
  console.log('GET request received for cities search');
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    console.log('Query parameter missing');
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  // Mock cities data for development
  const mockCities = [
    { city: 'Toronto', code: 'YYZ' },
    { city: 'Tokyo', code: 'HND' },
    { city: 'London', code: 'LHR' },
    { city: 'New York', code: 'JFK' },
    { city: 'Paris', code: 'CDG' },
    { city: 'Los Angeles', code: 'LAX' },
    { city: 'Dubai', code: 'DXB' },
    { city: 'Singapore', code: 'SIN' },
    { city: 'Hong Kong', code: 'HKG' },
    { city: 'Sydney', code: 'SYD' }
  ];

  try {
    console.log('Searching for query:', query);
    // Filter cities that match the query (case-insensitive)
    const filteredCities = mockCities.filter(city => 
      city.city.toLowerCase().includes(query.toLowerCase()) ||
      city.code.toLowerCase().includes(query.toLowerCase())
    );

    console.log('Found matching cities:', filteredCities);
    
    // Return the filtered cities with CORS headers
    return new NextResponse(JSON.stringify(filteredCities), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return handleApiError(error);
  }
}


export async function POST(request) {
  console.log('POST request received for flight search');
  
  // try {
    // Get parameters from request body
    const body = await request.json();
    console.log('Request body:', body);

    const { origin: sourceQuery, destination: destinationQuery, date } = body;
    const departureDate = date[0];
    const returnDate = date[1];
    const tripType = returnDate ? 'roundtrip' : 'one-way';

    console.log('Extracted parameters:', { sourceQuery, destinationQuery, departureDate, returnDate, tripType });

    if (!sourceQuery || !destinationQuery || !departureDate) {
      console.log('Missing parameters:', { sourceQuery, destinationQuery, departureDate });
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters (origin, destination, date)', 
          code: 'MISSING_PARAMS',
          requestBody: body 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert city names to airport codes if needed
    async function getCityCode(cityName) {
      console.log(`Searching for airport code for: ${cityName}`);
      
      // If it's already an airport code (3 letters), return as is
      if (cityName.length === 3 && cityName.toUpperCase() === cityName) {
        console.log(`${cityName} appears to be an airport code already, using as is`);
        return cityName;
      }

      try {
        const response = await fetch(
          `${AFS_API_URL}/api/airports`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': AFS_API_KEY
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch airports');
        }

        const airports = await response.json();
        console.log(`Searching through ${airports.length} airports for ${cityName}`);

        // Try to find an exact match for the city name
        const exactMatch = airports.find(
          airport => airport.city.toLowerCase() === cityName.toLowerCase()
        );

        if (exactMatch) {
          console.log(`Found exact match for ${cityName}: ${exactMatch.code}`);
          return exactMatch.code;
        }

        // If no exact match, try partial match
        const partialMatch = airports.find(
          airport => airport.city.toLowerCase().startsWith(cityName.toLowerCase())
        );

        if (partialMatch) {
          console.log(`Found partial match for ${cityName}: ${partialMatch.code}`);
          return partialMatch.code;
        }

        throw new Error(`No airport code found for ${cityName}`);

      } catch (error) {
        console.error(`Error getting airport code for ${cityName}:`, error);
        throw new Error(`Could not find airport code for ${cityName}: ${error.message}`);
      }
    }

    // Convert both cities to airport codes
    let source, destination;
    try {
      source = await getCityCode(sourceQuery);
      if (!source) {
        throw new Error(`No airport code found for ${sourceQuery}`);
      }
      console.log(`Resolved source ${sourceQuery} to airport code: ${source}`);

      destination = await getCityCode(destinationQuery);
      if (!destination) {
        throw new Error(`No airport code found for ${destinationQuery}`);
      }
      console.log(`Resolved destination ${destinationQuery} to airport code: ${destination}`);

      if (source === destination) {
        return NextResponse.json({
          error: `Origin (${sourceQuery} → ${source}) and destination (${destinationQuery} → ${destination}) resolved to the same airport code. Please use different cities.`,
          code: 'SAME_AIRPORT'
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error during city code resolution:', error);
      return NextResponse.json({
        error: error.message,
        code: 'INVALID_CITY'
      }, { status: 400 });
    }

    // Date validations
    if (!isValidDate(departureDate)) {
      
      return NextResponse.json({
        error: 'Invalid departure date format (use YYYY-MM-DD)',
        code: 'INVALID_DATE'
      }, { status: 400 });
    }

    if (tripType === 'roundtrip') {
      if (!returnDate) {
        return NextResponse.json({
          error: 'Return date is required for round-trip flights',
          code: 'MISSING_RETURN_DATE'
        }, { status: 400 });
      }

      if (!isValidDate(returnDate)) {
        return NextResponse.json({
          error: 'Invalid return date format (use YYYY-MM-DD)',
          code: 'INVALID_RETURN_DATE'
        }, { status: 400 });
      }

      if (!isValidDateRange(departureDate, returnDate)) {
        return NextResponse.json({
          error: 'Return date must be after departure date',
          code: 'INVALID_DATE_RANGE'
        }, { status: 400 });
      }
    }

    console.log('Making flight search request with:', {
      source,
      destination,
      departureDate: formatDate(departureDate),
      returnDate: returnDate ? formatDate(returnDate) : undefined
    });

    // Create query string with the required parameters
    const outboundQueryString = new URLSearchParams({
      origin: source,
      destination: destination,
      date: formatDate(departureDate)
    }).toString();

    const outboundUrl = `${AFS_API_URL}/api/flights?${outboundQueryString}`;
    console.log('Making outbound flight API request to:', outboundUrl);
    console.log('Using API key:', AFS_API_KEY ? 'Defined (value hidden)' : 'Not defined');

    const outboundResponse = await fetch(outboundUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AFS_API_KEY
      }
    });

    console.log('Outbound response received:', outboundResponse.status);
    
    if (!outboundResponse.ok) {
      const errorData = await outboundResponse.text();
      console.log('Error response:', errorData);
      
      let errorJson;
      try {
        errorJson = JSON.parse(errorData);
      } catch (e) {
        console.error('Failed to parse error response as JSON:', e);
        return NextResponse.json({
          success: false,
          error: `API returned non-JSON response: ${errorData.substring(0, 200)}...`,
          status: outboundResponse.status,
          code: 'API_ERROR'
        }, { status: 502, headers: corsHeaders });
      }
      
      // Check for specific error about airports not found
      if (errorJson.error?.includes('No airports found')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid airport codes. Please use valid airport codes (e.g., YYZ for Toronto, JFK for New York).',
          code: 'INVALID_AIRPORT'
        }, { status: 400, headers: corsHeaders });
      }
      
      throw new Error(`HTTP error! status: ${outboundResponse.status}, details: ${errorData}`);
    }
    
    const outboundData = await outboundResponse.json();
    console.log('Outbound data received:', outboundData);

    // For round-trip flights, fetch return flights
    let returnData = null;
    if (tripType === 'roundtrip') {
      const returnQueryString = new URLSearchParams({
        origin: destination, // Swap origin and destination for return flight
        destination: source,
        date: formatDate(returnDate)
      }).toString();

      const returnUrl = `${AFS_API_URL}/api/flights?${returnQueryString}`;
      console.log('Making return flight API request to:', returnUrl);

      const returnResponse = await fetch(returnUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AFS_API_KEY
        }
      });

      if (!returnResponse.ok) {
        const errorData = await returnResponse.text();
        throw new Error(`HTTP error! status: ${returnResponse.status}, details: ${errorData}`);
      }

      returnData = await returnResponse.json();
      console.log('Return data received:', returnData);
    }
    
    // Check for empty or missing results
    const hasOutboundFlights = outboundData.results && outboundData.results.length > 0;
    const hasReturnFlights = tripType !== 'roundtrip' || (returnData && returnData.results && returnData.results.length > 0);

    if (!hasOutboundFlights || !hasReturnFlights) {
      return NextResponse.json({
        success: false,
        error: tripType === 'roundtrip' 
          ? `No flights available for round-trip from ${source} to ${destination} on ${formatDate(departureDate)} - ${formatDate(returnDate)}.`
          : `No flights available from ${source} to ${destination} on ${formatDate(departureDate)}.`,
        code: 'NO_FLIGHTS_AVAILABLE'
      }, { status: 404 });
    }
    
    // Format flight details
    const formatFlightResults = (flightData) => flightData.results.map(result => {
      const totalPrice = result.flights.reduce((sum, flight) => sum + flight.price, 0);
      const totalDuration = result.flights.reduce((sum, flight) => sum + flight.duration, 0);
      
      return {
        id: result.flights[0].id, // Use first flight's ID for the itinerary
        legs: result.legs,
        departure: {
          airport: result.flights[0].origin.code,
          city: result.flights[0].origin.city,
          time: result.flights[0].departureTime,
          terminal: result.flights[0].departure_terminal
        },
        arrival: {
          airport: result.flights[result.flights.length - 1].destination.code,
          city: result.flights[result.flights.length - 1].destination.city,
          time: result.flights[result.flights.length - 1].arrivalTime,
          terminal: result.flights[result.flights.length - 1].arrival_terminal
        },
        duration: totalDuration,
        stops: result.legs - 1,
        layovers: result.flights.slice(0, -1).map((flight, index) => ({
          airport: flight.destination.code,
          city: flight.destination.city,
          duration: result.flights[index + 1].departureTime - flight.arrivalTime
        })),
        airlines: result.flights.map(flight => flight.airline),
        flightNumbers: result.flights.map(flight => flight.flightNumber),
        price: totalPrice,
        currency: result.flights[0].currency,
        availableSeats: Math.min(...result.flights.map(f => f.availableSeats || 0))
      };
    });

    const outboundFlights = formatFlightResults(outboundData);
    const returnFlights = returnData ? formatFlightResults(returnData) : null;

    console.log('Formatted outbound flights:', outboundFlights);
    console.log('Formatted return flights:', returnFlights);
    return NextResponse.json({
      success: true,
      outbound: {
        results: outboundFlights,
        total: outboundData.results.length
      },
      ...(returnFlights && {
        return: {
          results: returnFlights,
          total: returnData.results.length
        }
      }),
      tripType
    }, { headers: corsHeaders }, { status: 200 });
  // } catch (error) {
    console.error('Error caught in flight search:', error);
    return handleApiError(error);
  // }
}
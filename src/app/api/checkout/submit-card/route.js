import { NextResponse } from "next/server";
import {validateFullCard} from "./validate_card.js"

export async function POST(request){
    try {
        var card = await request.json();
    }
    catch{
        return NextResponse.json({error: "Cannot parse json file "}, {status: 400})
    }

    if (typeof card.number!=="string"){
        return NextResponse.json({error: "Bad request, card number must be in string"}, {status: 400})
    }

    if (!card.number || !card.month || !card.year || !card.cvv){
        return NextResponse.json({error: "Bad request, must have name, month, year, cvv"}, {status: 400})
    }

    if (!validateFullCard(card.number, card.month, card.year, card.cvv).valid){
        return NextResponse.json({error: "Your card must be valid"}, {status: 400})
    }

    return NextResponse.json({message: "Card submitted!"}, {status: 201})

}
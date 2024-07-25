import {NextRequest, NextResponse} from "next/server"
import { CheckAuthorization } from "./igdb/auth"

export default async function middleware(request: NextRequest) 
{
    console.log("Middling....")
   return await CheckAuthorization(request);
}
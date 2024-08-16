import {NextRequest, NextResponse} from "next/server"
import { CheckAuthorization } from "./igdb/auth"

export default async function middleware(request: NextRequest) 
{
    console.log(`Middling.... @ ${request.nextUrl.pathname}`)
   return await CheckAuthorization(request);
}

export const config = {
    // The above middleware would only run for the "/" path
    matcher: '/',
  }
  
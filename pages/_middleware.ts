import { getToken } from "next-auth/jwt"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"




 export const middleware = async (req) => {

    

    const token = await getToken({ req, secret: process.env.JWT_SECRET || 'middleware: wrong secret',  secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL_URL });

    const {pathname, origin} = req.nextUrl;
  
    

    if (pathname.includes("/api/auth") || token){
       
        return NextResponse.next();

    }

    if (!token && pathname !== `/login`){
        
        console.log('redirect to login page')
        return NextResponse.redirect(`${origin}/login`)
    }



}
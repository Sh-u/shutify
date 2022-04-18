import { getToken } from "next-auth/jwt"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"




 export const middleware = async (req) => {

    console.log('middleware here')

    const token = await getToken({ req, secret: process.env.JWT_SECRET ?? 'wrong secret middleware',  secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL_URL });
    
    if (!token){
        console.log('no token');
        return NextResponse.error();
    }


    const {pathname, origin} = req.nextUrl;
  
    

    if (pathname.includes("/api/auth") || token){
       
        return NextResponse.next();

    }

    if (!token && pathname !== `/login`){
        
        console.log('redirect to login page')
        return NextResponse.redirect(`${origin}/login`)
    }



}
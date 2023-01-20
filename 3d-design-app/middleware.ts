import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const getCookie = req.cookies.get('auth')?.value
    let cookieVal

    if (getCookie) {
        cookieVal = JSON.parse(getCookie)
    } else {
        // do nothing
    }
    
    console.log(getCookie);
    return NextResponse.next()

    // if (cookieVal.userState) {
    //     return NextResponse.next()
    // } else {
    //     return NextResponse.redirect(new URL('http://localhost:3000/logIn'))
    // }
}

export const config = {
    matcher: '/dashboard/:path*'
}
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const getCookie = req.cookies.get('auth')?.value
    const path = req.nextUrl.pathname
    let cookieVal

    if (getCookie) {
        cookieVal = JSON.parse(getCookie)
    }

    if (cookieVal) {
        if (cookieVal.userState && path === '/logIn') {
            return NextResponse.redirect(new URL(`http://localhost:3000/dashboard/${cookieVal.userId}`))

        } else if (cookieVal.userState && path.split('/')[2] === cookieVal.userId) {
            return NextResponse.next()

        } else if (!cookieVal.userState && path === '/logIn') {
            return NextResponse.next()

        } else {
            return NextResponse.redirect(new URL('http://localhost:3000'))
        }
    } else if (!cookieVal && path !== '/logIn') {
        return NextResponse.redirect(new URL('http://localhost:3000'))
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/logIn']
}
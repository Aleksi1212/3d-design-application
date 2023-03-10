import { ReactNode } from 'react'

import { cookies } from 'next/headers'

import MessageSideBar from '../../../src/components/social/messaging/messageSideBar'
import '../../../styles/index.css'

export default function MessagesLayout({
    children
} : {
    children: ReactNode
}) {
    const nextCookies = cookies()
    const authCookie = nextCookies.get('auth') as any

    const currentUser = JSON.parse(authCookie?.value)

    return (
        <section className='h-[100vh] w-full flex'>
            <MessageSideBar user={{ userId: currentUser.userId }} />
            {children}
        </section>
    )
}
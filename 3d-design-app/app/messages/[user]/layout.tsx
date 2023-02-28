import { ReactNode } from 'react'

import MessageSideBar from '../../../src/components/social/messageSideBar'
import '../../../styles/index.css'

export default function MessagesLayout({
    children
} : {
    children: ReactNode
}) {
    return (
        <section className='h-[100vh] w-full flex'>
            <MessageSideBar />
            {children}
        </section>
    )
}
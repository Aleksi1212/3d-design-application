import { cookies } from 'next/headers'

import Notifications from '../../../src/components/social/notifications'

export default function NotificationPage({ params }: any) {
    const userData = params.user.split('%3D')

    const nextCookies = cookies()
    const authCookie = nextCookies.get('auth') as any

    const currentUser = JSON.parse(authCookie?.value)

    if (currentUser.userId !== userData[0]) {
        return (
            <h1 className='text-white'>401 | unauthorized</h1>
        )
    }

    return (
        <Notifications user={{ currentUserId: currentUser.userId, userName: userData[1] }} />
    )
}
import ProfilePage from "../../../src/components/profilePage";
import { cookies } from 'next/headers'

export default async function Profile({ params }: any) {
    const userData = params.user.split('%3D')

    const nextCookies = cookies()
    const authCookie = nextCookies.get('auth') as any    

    return (
        <ProfilePage user={{ userId: userData[0], userName: userData[1], currentUser: JSON.parse(authCookie?.value) }} />
    )
}
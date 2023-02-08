import ProfilePage from "../../../src/components/profilePage";
import { cookies } from 'next/headers'

import { db } from "../../../src/datalayer/config";
import { collectionGroup, query, where, getCountFromServer } from "firebase/firestore";

export default async function Profile({ params }: any) {
    const userData = params.user.split('%3D')

    const nextCookies = cookies()
    const authCookie = nextCookies.get('auth') as any
    
    const currentUser = JSON.parse(authCookie?.value)

    const que = query(collectionGroup(db, 'friendRequests'), where('sentTo', '==', currentUser.userId))
    const snapshot = await getCountFromServer(que)
    const count = snapshot.data().count

    return (
        <ProfilePage user={{ userId: userData[0], userName: userData[1], currentUser: currentUser, pendingCount: count }} />
    )
}
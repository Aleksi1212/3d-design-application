
import UserDashboard from "../../../src/components/dashBoard"

import { cookies } from 'next/headers'

function Dashboard({ params }: any) {
    const test = cookies()
    const userCookie = test.get('auth') as any
    console.log(JSON.parse(userCookie?.value))

    return (
        <UserDashboard currentUser={{ currentUserId: params.id }} />
    )
}

export default Dashboard

import UserDashboard from "../../../src/components/dashBoard"

async function Dashboard({ params }: any) {
    const res = await fetch('http://localhost:3000/api/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: params.id })
    })

    const test = await res.json()

    return (
        <UserDashboard currentUser={{ currentUserId: params.id, test: test.userData }} />
    )
}

export default Dashboard

import UserDashboard from "../../../src/components/designing/dashBoard"

async function Dashboard({ params }: any) {
    return (
        <UserDashboard currentUser={{ currentUserId: params.id }} />
    )
}

export default Dashboard
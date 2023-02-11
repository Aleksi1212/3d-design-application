
import Dashboard from "../../../src/components/dashboard"

function UserHomePage({ params }: any) {
    return (
        <Dashboard currentUser={{ userId: params.id }} />
    )
}

export default UserHomePage
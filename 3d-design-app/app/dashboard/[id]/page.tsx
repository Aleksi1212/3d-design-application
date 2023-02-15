
import UserDashboard from "../../../src/components/dashBoard"

function Dashboard({ params }: any) {
    // const test = cookies()
    // const userCookie = test.get('auth') as any
    // console.log(JSON.parse(userCookie?.value))

    // auth.onAuthStateChanged((user) => {
    //     if (user) {
    //         console.log('user')
    //     } else {
    //         console.log('no user')
    //     }
    // })

    return (
        <UserDashboard currentUser={{ currentUserId: params.id }} />
    )
}

export default Dashboard
import ProfilePage from "../../../src/components/profilePage"


export default function Profile({ params }: any) {
    const userData = params.user.split('%3D')

    return (
        <ProfilePage user={{ userId: userData[0], userName: userData[1] }} />
    )
}
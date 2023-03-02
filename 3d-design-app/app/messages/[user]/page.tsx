import MessageStartPage from "../../../src/components/social/messageStartpage"


export default function MessagesStart({ params }: any) {
    const userData = params.user.split('%3D')

    return <MessageStartPage user={{ userId: userData[0], userName: userData[1] }} />
}
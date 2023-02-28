import MessageStartPage from "../../../src/components/social/messageStartpage"


export default function MessagePage({ params }: any) {
    const userData = params.user.split('%3D')


    return <MessageStartPage user={{ userId: userData[0] }} />
}
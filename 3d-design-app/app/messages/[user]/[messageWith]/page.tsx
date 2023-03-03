import MessageBox from "../../../../src/components/social/messageBox"

export default function MessagingBox({ params }: any) {
    const userData = params.messageWith.split('%3D')

    return <MessageBox user={{ userMessagingId: userData[0], userName: userData[1] }} />
}
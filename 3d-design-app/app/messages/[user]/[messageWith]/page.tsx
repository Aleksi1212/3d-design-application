import MessageBox from "../../../../src/components/social/messaging/messagingBox"

export default function MessagingBox({ params }: any) {
    const userData = params.messageWith.split('%3D')
    const viewingUserData = params.user.split('%3D')

    return <MessageBox user={{ 
        userMessagingId: userData[0],
        userName: userData[1],
        viewingUserName: viewingUserData[1].split('_')[0],
        viewingUserMessagingId: viewingUserData[1].split('_')[1],
        viewingUserId: viewingUserData[0]
    }} />
}
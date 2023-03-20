// import updateFriendOrUser from "../datalayer/firestoreFunctions/updateFriendOrUser";
import images from "./importImages";
import UpdateFriendOrUser from "../datalayer/firestoreFunctions/updateFriendOrUser";

function profileHeaders(userId: string, currentUserName: string, currentUserMessagingId: string, userName: string, messagingId: string, currentUserId: string, blocked: boolean) {    
    const actions = userId === currentUserId ? [
        { image: images.message, color: '#5D5D5D', message: 'Messages', key: 'messagees', type: 'link', link: `/messages/${currentUserId}=${currentUserName}_${currentUserMessagingId}` },
        { image: images.friendNoti, color: '#5D5D5D', message: 'Notifications', key: 'notifications', type: 'link', link: `/notifications/${currentUserId}=${currentUserName}` },
        { image: images.settings, color: '#5D5D5D', message: 'Settings', key: 'edit', type: 'func', link: null }
        
    ] : !blocked ? [
        { image: images.message, color: '#5D5D5D', message: 'Message', key: 'message', type: '', link: null},
        { image: images.addFriend, color: '#40C057', message: 'Add', key: 'add', type: 'func', link: null},
        { image: images.block, color: '#FA5252', message: 'Block', key: 'block', type: 'func', link: null}

    ] : [
        { image: images.block, color: '#FA5252', message: 'Unblock', key: 'unblock', type: 'func', link: null}
    ]

    const params = { 
        userId: currentUserId, userName: currentUserName, userMessagingId: currentUserMessagingId,
        friendId: userId, friendName: userName, friendMessagingId: messagingId, blockedUserId: userId
    }

    return {
        actions: actions,
        params: params
    }
}

async function profileActions(userId: string, userName: string, userMessagingId: string, friendId: string, friendName: string, friendMessagingId: string, blockedUserId: string, method: string) {
    const initializeActions = await UpdateFriendOrUser.createDocId(userId)

    if (method === 'remove') {
        const removeFriend = await initializeActions.removeFriend(userId, friendId)
        return removeFriend

    } else if (method === 'add') {
        const sendFriendRequest = await initializeActions.sendFriendRequest(userId, userName, userMessagingId, friendId, friendName, friendMessagingId)
        return sendFriendRequest

    } else if (method === 'block') {
        const blockUser = await initializeActions.blockUser(blockedUserId, userId)
        return blockUser

    } else if (method === 'unblock') {
        const unBlockUser = await initializeActions.unBlockUser(blockedUserId)
        return unBlockUser
    }

    return { message: 'error', image: images.error, type: 'error' }
}


export {
    profileHeaders,
    profileActions
}
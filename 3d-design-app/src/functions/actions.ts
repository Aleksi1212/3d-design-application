import { updateFriendOrUser } from "../datalayer/querys";
import images from "./importImages";

function userActions(userId: string, currentUserName: string, userMessagingId: string, userName: string, messagingId: string, currenUserId: string, userState: any, blocked: boolean) {    
    const actions = userId === currenUserId ? [
        userState ? {
            image: images.unlockProfile, color: '#5D5D5D', message: 'Unlock', key: 'unlock', type: 'func', action: updateFriendOrUser, params: {
                userId: currenUserId, userName: null, action: 'update', friendId: null, friendName: null, friendMessagingId: null,
                userMessagingId: null, friendOrUser: 'user', state: false, blockedUser: null, image: null
            }
        } : {
            image: images.lockProfile, color: '#5D5D5D', message: 'Lock', key: 'lock', type: 'func', action: updateFriendOrUser, params: {
                userId: currenUserId, userName: null, action: 'update', friendId: null, friendName: null, friendMessagingId: null,
                userMessagingId: null, friendOrUser: 'user', state: true, blockedUser: null, image: null
            }
        },

        { image: images.settings, color: '#5D5D5D', message: 'Settings', key: 'edit', type: 'link', action: null, params: null },
        { image: images.friendNoti, color: '#5D5D5D', message: 'Notifications', key: 'notifications', type: 'link', action: null, params: `/notifications/${currenUserId}=${currentUserName}` },
        { image: images.signOut, color: '#FA5252', message: 'Sign Out', key: 'signOut', type: '', action: null, params: null}
    ] : !blocked ? [
        { image: images.message, color: '#5D5D5D', message: 'Message', key: 'message', type: '', action: null, prams: null},

        { image: images.addFriend, color: '#40C057', message: 'Add', key: 'add', type: 'func', action: updateFriendOrUser, params: {
            userId: currenUserId, userName: currentUserName, action: 'add', friendId: userId, friendName: userName, friendMessagingId: messagingId,
            userMessagingId: userMessagingId, friendOrUser: 'friend', state: null, blockedUser: null, image: null
        } },
        { image: images.block, color: '#FA5252', message: 'Block', key: 'block', type: 'func', action: updateFriendOrUser, params: {
            userId: currenUserId, userName: null, action: 'block', friendId: null, friendName: null, friendMessagingId: null,
            userMessagingId: null, friendOrUser: 'user', state: null, blockedUser: userId, image: null
        } }
    ] : [
        { image: images.block, color: '#FA5252', message: 'Unblock', key: 'unblock', type: 'func', action: updateFriendOrUser, params: {
            userId: currenUserId, userName: null, action: 'unBlock', friendId: null, friendName: null, friendMessagingId: null,
            userMessagingId: null, friendOrUser: 'user', state: null, blockedUser: userId, image: null
        } }
    ]

    return actions
}

export default userActions
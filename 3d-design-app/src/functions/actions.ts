import { updateFriendOrUser } from "../datalayer/querys";
import images from "./importImages";

function userActions(userId: string, userName: string, messagingId: string, currenUserId: string, userState: any, blocked: boolean) {    
    const actions = userId === currenUserId ? [
        userState ? {
            image: images.unlockProfile, color: '#5D5D5D', message: 'Unlock', key: 'unlock', action: updateFriendOrUser, params: {
                userId: currenUserId, action: 'update', friendId: null, friendName: null, messagingId: null, friendOrUser: 'user', state: false, blockedUser: null, profile: null
            }
        } : {
            image: images.lockProfile, color: '#5D5D5D', message: 'Lock', key: 'lock', action: updateFriendOrUser, params: {
                userId: currenUserId, action: 'update', friendId: null, friendName: null, messagingId: null, friendOrUser: 'user', state: true, blockedUser: null, profile: null
            }
        },

        { image: images.editProfile, color: '#5D5D5D', message: 'Edit', key: 'edit', action: null, params: null },
        { image: images.signOut, color: '#FA5252', message: 'Sign Out', key: 'signOut', action: null, params: null}
    ] : !blocked ? [
        { image: images.message, color: '#5D5D5D', message: 'Message', key: 'message', action: null, prams: null},

        { image: images.addFriend, color: '#40C057', message: 'Add', key: 'add', action: updateFriendOrUser, params: {
            userId: currenUserId, action: 'add', friendId: userId, friendName: userName, messagingId: messagingId, friendOrUser: 'friend', state: null, blockedUser: null, profile: null
        } },
        { image: images.block, color: '#FA5252', message: 'Block', key: 'block', action: updateFriendOrUser, params: {
            userId: currenUserId, action: 'block', friendId: null, friendName: null, messagingId: null, friendOrUser: 'user', state: null, blockedUser: userId
        } }
    ] : [
        { image: images.block, color: '#FA5252', message: 'Unblock', key: 'unblock', action: updateFriendOrUser, params: {
            userId: currenUserId, action: 'unBlock', friendId: null, friendName: null, messagingId: null, friendOrUser: 'user', state: null, blockedUser: userId
        } }
    ]

    return actions
}

export default userActions
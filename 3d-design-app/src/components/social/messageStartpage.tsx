'use client';

import images from "../../functions/importImages";

import Image from "next/image";

import useUserData from "../../hooks/userDataHook";
import UserCard from "./userCardProfile";

function MessageStartPage({ user }: any) {
    const { userId } = user || {}

    const userData = useUserData(userId, userId)

    let currentUserFriends: any = []
    userData.currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })

    return (
        <div className="flex flex-col h-full w-[80%]">
            <nav className="w-full h-[9%] bg-[#F6F7F9] flex justify-between items-center px-16">
                <div className="w-[25rem] h-full flex items-center justify-between text-xl">
                    <button className="w-[50%] h-[80%] rounded-md focus:bg-[#D3D3D3] hover:bg-[#D9D9D9]">Friends</button>
                    <button className="w-[50%] h-[80%] rounded-md focus:bg-[#D3D3D3] hover:bg-[#D9D9D9]">Blocked Users</button>
                </div>

                <div className="w-[20rem] h-[2rem] flex items-center justify-between relative rounded-md shadow-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-2" />
                    <input type="text" placeholder="Search" className="w-full bg-white h-full pl-8 rounded-md" />
                </div>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] relative px-14 pt-5">
                {/* {
                    userData.friendData.map((friend: any) => {
                        return <UserCard key={friend.friendId}
                        user={{
                            viewingUser: userId,
                            usersId: friend.friendId,
                            usersName: friend.friendName,
                            messagingId: friend.messagingId,
                            initialAction: { message: 'Message', action: '', image: images.message },
                            secondaryAction: friend.friendId === userId ? 

                            { message: 'Edit Profile', color: '#40C057', action: '' } :
                            currentUserFriends.includes(friend.friendId) ? { message: 'Remove Friend', color: '#FA5252', action: 'remove' } : 
                            { message: 'Add Friend', color: '#40C057', action: 'add' }
                        }}/>
                    })
                } */}

                <div className="w-full max-h-full h-full overflow-auto gap-y-[2px] flex flex-col" id="users">
                    <h1 className="mb-3 ml-4 opacity-75">Friends - num</h1>

                    <div className="w-[90%] h-[5rem] rounded-md px-5 flex justify-between items-center hover:bg-[#F2F3F9] relative">
                        <div className="absolute w-[97%] h-[2px] bg-[#8D8D8D] top-[-2px]"></div>

                        <div className="flex justify-start w-[70rem]">
                            <div className="w-[4rem] h-[4rem] bg-white rounded-full flex justify-center items-center">
                                <Image src={images.userProfile} alt="profile" width={30} />
                            </div>
                        </div>

                        <div className="w-[8rem] flex justify-between">
                            <button className="friendButton">
                                <Image src={images.message} alt="message" />
                            </button>

                            <button className="friendButton">
                                <Image src={images.userMenu} alt="menu" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageStartPage
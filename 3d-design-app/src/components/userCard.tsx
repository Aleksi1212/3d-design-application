'use client';

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useImages from "../hooks/importImages";

import { updateFriendOrUser } from "../datalayer/querys";

function UserCard({ user }: any) {
    const { viewingUser, usersId, usersName, messagingId, action } = user || {}

    const [overUser, setOverUser] = useState(false)
    const [overMenu, setOverMenu] = useState(false)
    const [clicked, setClicked] = useState(false)

    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

    const router = useRouter()
    
    return (
        <div className="w-[73%] h-[5rem] flex items-center justify-between border-b-2 border-gray-300 p-2 bg-white" id="friend" 
            onMouseEnter={() => setOverUser(true)} onMouseLeave={() => {setOverUser(false); setClicked(false)}}>
            <Link className="w-[75%]" href={`/profile/${usersId}=${usersName}`}>
                <div className="flex items-center text-lg gap-x-5">
                    <div className="h-[4rem] w-[4rem] bg-gray-100 shadow-lg rounded-full flex justify-center items-center">
                        <Image src={images['userProfile.png']} alt="profileImage" width={30} height={30} />
                    </div>
                    
                    <div>
                        <h1>{usersName}</h1>
                        <p className="text-xs opacity-90">{messagingId}</p>
                    </div>
                </div>
            </Link>


            <div className="flex w-[7rem] justify-between relative">
                <button className="friendButton" id="message">
                    <Image src={images['message.png']} alt="message" />
                </button>
                
                <button className="friendButton" id="menu" onClick={() => setClicked(true)}>
                    <Image src={images['userMenu.png']} alt="userMenu" />
                </button>

                <div className="messageFriend right-12 w-[5rem]">
                    Message
                </div>

                <div className="friendActions">
                    More
                </div>

                <div className="absolute w-[10rem] bg-[#5D5D5D] -right-[10.5rem] -top-[1.55rem] text-white rounded-md transition-all duration-200 origin-left" id="friendMenu"
                    onMouseEnter={() => setOverMenu(true)} onMouseLeave={() => setOverMenu(false)}
                    style={{ transform: overUser && clicked || overMenu && clicked ? 'scale(1)' : 'scale(0)' }}>

                    <button onClick={() => router.push(`/profile/${usersId}=${usersName}`)} className=" w-full h-[2rem] rounded-tr-md rounded-tl-md hover:bg-[#40C057]">View Profile</button>

                    <button className={`w-full border-y-2 h-[2rem] hover:bg-[${action.color}]`} 
                    onClick={() => {
                        if (action.action === 'add' || action.action === 'remove') {
                            updateFriendOrUser(viewingUser, action.action, usersId, usersName, messagingId, 'friend', null, null)
                        }
                    }}>
                    {action.message}</button>

                    <button className="w-full h-[2rem] rounded-bl-md rounded-br-md hover:bg-[#FA5252]" 
                    onClick={() => updateFriendOrUser(viewingUser, 'block', null, null, null, 'user', null, usersId)}>Block User</button>
                </div>
            </div>
        </div>
    )
}

export default UserCard
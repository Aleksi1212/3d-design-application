'use client';

import Image from "next/dist/client/image";

import userProfile from '../images/userProfile.png'
import addFriend from '../images/addFriend.png'
import unfriend from '../images/addFriend.png'
import block from '../images/block.png'
import message from '../images/message.png'
import userMenu from '../images/userMenu.png'

import { db } from "../datalayer/config";
import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";

import { useEffect, useState } from "react";

function ProfilePage({ user }: any) {
    const { userId, userName } = user || {}

    const [friendData, setFriendData] = useState([])

    useEffect(() => {
        const que = query(collectionGroup(db, 'friends'), where('user', '==', userId))

        const getFriendData = onSnapshot(que, (querySnapshot) => {
            let friends: any = []
            querySnapshot.forEach((friend) => {
                friends.push(friend.data().friendData)
            })

            setFriendData(friends)
        })

        return () => getFriendData()
    }, [])

    return (
        <section className="bg-[#F6F7F9] w-full h-[100vh] flex justify-center items-center">
            <div className="w-[40rem] h-[50rem] bg-white shadow-lg flex flex-col items-center justify-evenly rounded-xl">
                <div className="w-full flex items-center justify-between pl-20 pr-20">
                    <div className="w-[12rem] h-[12rem] shadow-lg bg-gray-100 rounded-full flex justify-center items-center">
                        <Image src={userProfile} alt="profileImage" />
                    </div>

                    <div className="flex flex-col justify-between gap-y-4">
                        <h1 className="text-3xl">{userName}</h1>
                        <div className="flex justify-between">
                            <button id="profileAction">
                                <Image src={message} alt="message" />
                                <div className="bg-[#5D5D5D]" id="profileBar"></div>
                            </button>

                            <button id="profileAction">
                                <Image src={addFriend} alt="addFriend" />
                                <div className="bg-[#40C057]" id="profileBar"></div>
                            </button>

                            <button id="profileAction">
                                <Image src={block} alt="block" width={32} height={32} />
                                <div className="bg-[#FA5252]" id="profileBar"></div>
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="w-[80%] h-[2.5px] bg-[#5D5D5D] opacity-40" />

                <div className="w-full h-[30rem] flex flex-col items-center">
                    <div className="w-full flex justify-evenly text-[1.5rem]">
                        <button className="flex flex-col items-center" id="otherAction">
                            <h1>Friends</h1>
                            <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                        </button>

                        <button className="flex flex-col items-center" id="otherAction">
                            <h1>Designs</h1>
                            <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                        </button>
                    </div>

                    <div className="w-[80%] h-full flex flex-col items-center mt-5 border-t-2 border-gray-300 overflow-y-scroll">
                        {
                            friendData.map((friendCard: any) => {
                                return <FriendCard key={friendCard.friendId} friend={friendCard} />
                            })
                        }
                    </div>
                </div>
            </div>

        </section>
    )
}

function FriendCard({ friend }: any) {
    const { friendId, friendName } = friend || {}

    return (
        <div className="w-full h-[5rem] flex items-center justify-between border-b-2 border-gray-300 relative">
            <div className="flex items-center text-lg gap-x-5">
                <div className="h-[4rem] w-[4rem] bg-gray-100 shadow-lg rounded-full flex justify-center items-center">
                    <Image src={userProfile} alt="profileImage" width={30} height={30} />
                </div>

                <h1>{friendName}</h1>
            </div>

            <div className="flex w-[7rem] justify-between test">
                <button className="friendButton">
                    <Image src={message} alt="message" />
                </button>
                
                <button className="friendButton" id="menu">
                    <Image src={userMenu} alt="userMenu" />
                </button>

                <div className="friendActions">
                    More
                </div>

                <div className="absolute w-[10rem] bg-[#5D5D5D] -right-44 -top-[.5rem] text-white rounded-md transition-all scale-0 duration-200 origin-left" id="friendMenu">

                    <button className="w-full h-[2rem] rounded-tr-md rounded-tl-md hover:bg-[#40C057]">View Profile</button>
                    <button className="w-full border-y-2 h-[2rem] hover:bg-[#FA5252]">Remove Friend</button>
                    <button className="w-full h-[2rem] rounded-bl-md rounded-br-md hover:bg-[#FA5252]">Block User</button>

                </div>
            </div>

        </div>
    )
}

export default ProfilePage
'use client';

import Image from "next/image";
import Link from "next/link";

import { db } from "../datalayer/config";
import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { updateFriend } from "../datalayer/querys";

import { useEffect, useState } from "react";

import useImages  from '../hooks/importImages'

function ProfilePage({ user }: any) {
    const { userId, userName, currentUser } = user || {}

    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

    const [friendData, setFriendData] = useState([])

    const actions = userId === currentUser.userId ? [
        { image: images['lockProfile.png'], color: '#5D5D5D', message: 'Lock', key: 'lock' },
        { image: images['editProfile.png'], color: '#5D5D5D', message: 'Edit', key: 'edit' }
    ] : [
        { image: images['message.png'], color: '#5D5D5D', message: 'Message', key: 'message'},
        { image: images['addFriend.png'], color: '#40C057', message: 'Add', key: 'add' },
        { image: images['block.png'], color: '#FA5252', message: 'Block', key: 'block' }
    ]

    console.log(actions);

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
                        <Image src={images['userProfile.png']} alt="profileImage" />
                    </div>

                    <div className="flex flex-col justify-between gap-y-4">
                        <h1 className="text-3xl">{userName}</h1>
                        <div className="flex justify-between relative">
                            {
                                actions.map((action: any) => {
                                    return (
                                        <button id="profileAction" key={action.key}>
                                            <Image src={action.image} alt="action" />
                                            <div className={`bg-[${action.color}]`} id="profileBar"></div>
                                            <div className="actionBox">{action.message}</div>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <hr className="w-[80%] h-[2.5px] bg-[#5D5D5D] opacity-40" />

                <div className="w-full h-[30rem] flex flex-col items-center pt-2">
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

                    <div className="w-[110%] max-h-full h-full ml-[11.5rem] flex overflow-auto flex-col mt-2 pt-6" id="friendContainer">
                        {
                            friendData.map((friendCard: any) => {
                                return <FriendCard key={friendCard.friendId} friend={{ user: userId, friendId: friendCard.friendId, friendName: friendCard.friendName }} />
                            })
                        }
                    </div>
                </div>
            </div>

        </section>
    )
}

function FriendCard({ friend }: any) {
    const { user, friendId, friendName } = friend || {}

    const [overUser, setOverUser] = useState(false)
    const [overMenu, setOverMenu] = useState(false)
    const [clicked, setClicked] = useState(false)

    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))
    
    return (
        <div className="w-[73%] h-[5rem] flex items-center justify-between border-b-2 border-gray-300 p-2" id="friend" 
            onMouseEnter={() => setOverUser(true)} onMouseLeave={() => {setOverUser(false); setClicked(false)}}>
            <Link className="w-[75%]" href={`/profile/${friendId}=${friendName}`}>
                <div className="flex items-center text-lg gap-x-5">
                    <div className="h-[4rem] w-[4rem] bg-gray-100 shadow-lg rounded-full flex justify-center items-center">
                        <Image src={images['userProfile.png']} alt="profileImage" width={30} height={30} />
                    </div>

                    <h1>{friendName}</h1>
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

                <div className="absolute w-[10rem] bg-[#5D5D5D] -right-[10.5rem] -top-[1.4rem] text-white rounded-md transition-all duration-200 origin-left" id="friendMenu"
                    onMouseEnter={() => setOverMenu(true)} onMouseLeave={() => setOverMenu(false)}
                    style={{ transform: overUser && clicked || overMenu && clicked ? 'scale(1)' : 'scale(0)' }}>

                    <button className="w-full h-[2rem] rounded-tr-md rounded-tl-md hover:bg-[#40C057]">View Profile</button>
                    <button className="w-full border-y-2 h-[2rem] hover:bg-[#FA5252]" onClick={() => updateFriend(user, 'remove', friendId, '')}>Remove Friend</button>
                    <button className="w-full h-[2rem] rounded-bl-md rounded-br-md hover:bg-[#FA5252]">Block User</button>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
'use client';

import Image from "next/image";

import { db } from "../datalayer/config";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useState } from "react";
import useImages from "../hooks/importImages";

import UserCard from "./userCard";

function SearchUsers({ viewer }: any) {
    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

    const { userId, hidden } = viewer || {}

    const [userData, setUserData] = useState([]) as any
    
    async function searchUsers(userName: string) {
        if (userName.length > 0) {
            const que = query(collection(db, 'data'), where('username', '>=', userName), where('username', '<=', userName + '\uf8ff'))
            const querySnapshot = await getDocs(que)
            const users = querySnapshot.docs.map((doc) => doc.data())
    
            setUserData(users as any[])
        } else {
            setUserData([])
        }
    }

    return (
        <div className="w-[30rem] h-[50rem] shadow-lg bg-white rounded-xl p-6 transition-all" style={{ width: !hidden ? '5rem' : '30rem' }}>
            <div className="w-full h-[3rem] rounded-lg shadow-md flex items-center relative">
                <input type="text" className="w-full h-[3rem] rounded-lg pl-11 text-xl" onChange={(e) => searchUsers(e.target.value)} placeholder="Search Users" />
                <Image src={images['search.png']} alt="search" className="absolute left-3 pointer-events-none" width={25} height={25} />
            </div>

            <hr className="w-full bg-[#5D5D5D] h-[2px] opacity-50 mt-6" />

            <div className="w-[137%] h-[90%] max-h-[90%] overflow-auto flex flex-col pt-6" id="userContainer">
                {
                    userData.map((userCard: any) => {
                        return <UserCard key={userCard.userId} 
                        user={{
                            viewingUser: userId,
                            usersId: userCard.userId,
                            usersName: userCard.username,
                            messagingId: userCard.messagingId,
                            action: userCard.userId === userId ? { message: 'Edit Profile', color: '#40C057', action: '' } : { message: 'Add Friend', color: '#40C057', action: 'add' }
                        }} />
                    })
                }
            </div>
        </div>
    )
}

export default SearchUsers
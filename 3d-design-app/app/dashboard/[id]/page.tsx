
'use client';

import UserHome from "../../../src/components/userHome";

import Image from "next/image";
import Link from "next/link";

import images from "../../../src/functions/importImages";

import useUserData from "../../../src/hooks/userDataHook";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { auth } from "../../../src/datalayer/config";

import { cookieSetter, updateDesign } from "../../../src/datalayer/querys";


interface alertType {
    state: boolean,
    display: string
}

function Dashboard({ params }: any) {
    const router = useRouter()

    const [alert, setAlert] = useState<alertType>({ state: true, display: 'none' })

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log(user.uid)
        } else {
            const deleteCookie = await cookieSetter(false, null)
            
            if (deleteCookie === 'cookie set') {
                router.push('/logIn')
            }
        }
    })

    const designAndUserData = useUserData(params.id, params.id)

    async function userSignOut() {
        if (designAndUserData.currentUserMethod !== 'email') {
            signOut(auth)
            .then(() => {
                console.log('signed out');
            })
            .catch((err) => {
                console.log(err);
            })

        } else {
            const res = await fetch('http://localhost:3000/api/signOut', {
                method: 'GET'
            })

            const responseMessage = await res.json()

            if (responseMessage.message === 'ok') {
                await cookieSetter(false, null)
                // window.location.reload()
            }
        }    
    }

    return (
        <>
            <div className="absolute top-0 w-full h-[150vh] flex items-center flex-col">
                <h1 className="text-white text-5xl mt-24">Welcome Back {designAndUserData.currentUserName}</h1>

                <div className="max-w-[66rem] my-[6rem] flex gap-y-12 gap-x-12 flex-wrap ">
                    <div className="bg-white rounded-lg shadow-xl h-[15rem] w-[20rem] flex justify-center items-center cursor-pointer" id="doc"
                        onClick={() => updateDesign(params.id, 'add', '', '')}>
                        <div className="flex flex-col items-center text-[#1A73E8] gap-y-8 mt-8">
                            <Image src={images.addDoc} alt="addDoc" />
                            <h1>Add New Design</h1>
                        </div>
                    </div>

                    {
                        designAndUserData.designData.map((docCard: any) => {
                            return <DocumentCard key={docCard.docId} userId={params.id} docId={docCard.docId} docName={docCard.docName} />
                        })
                    }
                </div>

                <hr className="bg-[#5D5D5D] opacity-40 w-[50rem] pb-[1.5px]" />

                <div className="h-[20rem] w-[40rem] flex mt-[6rem]">
                    <div className="pl-10 pr-14 flex flex-col justify-evenly items-center relative">
                        <div className="w-[10rem] h-[10rem] rounded-full bg-white flex justify-center items-center shadow-lg">
                            <Image src={images.userProfile} alt="userProfile" />
                        </div>
                    
                        <div className="pl-2 text-[#737373] flex flex-col text-xl">
                            <h1>{designAndUserData.currentUserName}</h1>
                            <h1>{designAndUserData.currentUserEmail}</h1>
                        </div>
                    </div>

                    <hr className="bg-[#5D5D5D] opacity-40 w-[2px] h-[20rem] mr-14" />

                    <div className="h-full flex items-center">
                        <div className="flex flex-col h-[11rem] justify-evenly">
                            <Link href={`/profile/${params.id}=${designAndUserData.currentUserName}`} className="userButton bg-white flex justify-center items-center">Show Profile</Link>
                                <button className="userButton bg-white" onClick={userSignOut}>Sign Out</button>
                            <Link className="userButton bg-[#FA5252] flex justify-center items-center" href="/logIn/delete">Delete</Link>
                        </div>
                    </div>
                </div>
            </div>
            <UserHome />
        </>
    )
}

function DocumentCard(props: any) {
    return (
        <div className="bg-white rounded-lg shadow-xl h-[15rem] w-[20rem] flex justify-between flex-col cursor-pointer" id="doc">
            <Link href={`document/${props.userId}/${props.docId}=${props.docName}`} className="h-[85%]">
                <h1 className="pt-3 pl-4 text-xl">{props.docName}</h1>
            </Link>

            <div className="flex justify-between pb-3">
                <Image src={images.docMenu} alt="docMenu" className="ml-4" />
                
                <div className="flex justify-evenly w-[6rem]">
                    <Image src={images.docShare} alt="docShare" />
                    <Image src={images.docRemove} alt="docRemove" onClick={() => updateDesign(props.userId, 'remove', props.docId, '')} />
                </div>
            </div>
        </div>
    )
}


export default Dashboard
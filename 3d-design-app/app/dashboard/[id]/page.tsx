'use client';

import UserHome from "../../../src/components/userHome";
import { getUserData } from "../../../src/datalayer/querys";
import Profile from "../../../src/components/profileCard";

import Image from "next/image";
import Link from 'next/link'

import addDoc from '../../../src/images/addDoc.png'
import docMenu from '../../../src/images/docMenu.png'
import docShare from '../../../src/images/docShare.png'
import docRemove from '../../../src/images/docRemove.png'

import { useEffect, useState } from "react";

import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../src/datalayer/config";

import { updateDesign, addNewDesign } from "../../../src/datalayer/querys";

function UserHomePage({ params }: any) {
    const [userData, setUserData] = useState([])

    useEffect(() => {
        const que = query(collection(db, 'data'), where('userId', '==', params.id))

        const getUserDocs = onSnapshot(que, (querySnapshot) => {
            let data: any = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data())
            })

            setUserData(data)
        })

        return () => getUserDocs()
    }, [])

    let docs: any = []
    let userName: string = ''
    let userEmail: string = ''
    let userMethod: string = ''

    userData.map(async (data) => {
        data.documents.forEach((doc) => {
            docs.push(doc)
        })

        userName = data.username
        userEmail = data.email
        userMethod = data.method
    })

    return (
        <>
            <div className="absolute top-0 w-full h-[150vh] flex items-center flex-col">
                <h1 className="text-white text-5xl mt-24">Welcome Back test</h1>

                <div className="max-w-[66rem] my-[6rem] flex gap-y-12 gap-x-12 flex-wrap ">
                        <div className="bg-white rounded-lg shadow-xl h-[15rem] w-[20rem] flex justify-center items-center cursor-pointer" id="doc"
                            onClick={() => addNewDesign(params.id)}>
                            <div className="flex flex-col items-center text-[#1A73E8] gap-y-8 mt-8">
                                <Image src={addDoc} alt="addDoc" />
                                <h1>Add New Design</h1>
                            </div>
                        </div>

                        {
                            docs.map((docCard: any) => {
                                return <DocumentCard key={docCard.docId} userId={params.id} docId={docCard.docId} docName={docCard.docName} />
                            })
                        }
                </div>

                <hr className="bg-[#5D5D5D] opacity-40 w-[50rem] pb-[1.5px]" />

                <Profile userData={{
                    name: 'test',
                    email: 'test',
                    userId: params.id,
                    method: 'test'
                }} />
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
                <Image src={docMenu} alt="docMenu" className="ml-4" />
                
                <div className="flex justify-evenly w-[6rem]">
                    <Image src={docShare} alt="docShare" />
                    <Image src={docRemove} alt="docRemove" onClick={() => updateDesign(props.userId, 'remove', props.docId, props.docName)} />
                </div>
            </div>
        </div>
    )
}


export default UserHomePage
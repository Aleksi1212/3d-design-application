'use client';

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import images from "../functions/importImages";

import useUserData from "../hooks/userDataHook";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { auth } from "../datalayer/config";

import { cookieSetter, updateDesign } from "../datalayer/querys";

import { Loader } from "./profilePage";

interface errorScreenTypes {
    display: string
    message: string
    url: string
    state: boolean
}

interface alertTypes {
    message: string
    image: StaticImageData
    top: string
}

interface backgroundTypes {
    image: StaticImageData
    flexPos: string
    padLeft: string
    padTop: string
    padBottom: string
    key: string
}

interface svgPropType {
    svgProps: backgroundTypes
}

function UserDashboard({ currentUser }: any) {
    const { currentUserId, test } = currentUser || {}

    const router = useRouter()

    const [errorScreen, setErrorScreen] = useState<errorScreenTypes>({ display: 'none', message: '', url: '', state: false })
    const [alert, setAlert] = useState<alertTypes>({ message: 'ok', image: images.success, top: '-2.5rem' })
    const [manualSignOut, setManualSignOut] = useState(false)
    
    const designAndUserData = useUserData(currentUserId, currentUserId)

    const backgroundSvgs: Array<backgroundTypes> =  [
        { image: images.arrow1, flexPos: 'flex-end', padLeft: '6rem', padTop: '0', padBottom: '5rem', key: 'arrrow1' },
        { image: images.cross, flexPos: 'flex-start', padLeft: '18rem', padTop: '4rem', padBottom: '0', key: 'cross' },
        { image: images.arrow2, flexPos: 'center', padLeft: '30rem', padTop: '0', padBottom: '0', key: 'arrow2' },
        { image: images.arrow3, flexPos: 'flex-end', padLeft: '24rem', padTop: '0', padBottom: '2.5rem', key: 'arrow3' }
    ]

    useEffect(() => {
        if (alert.top !== '-2.5rem') {
            setTimeout(() => {
                setAlert({ message: alert.message, image: alert.image, top: '-2.5rem' })
            }, 2000)
        }
    }, [alert])

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log(user.uid)
        } else {
            const deleteCookie = await cookieSetter(false, null)
            
            if (deleteCookie === 'cookie set' && manualSignOut) {
                router.push('/logIn')
            }
        }
    })


    async function userSignOut() {
        const signOutPromise = await Promise.allSettled([
            signOut(auth)
        ])

        if (signOutPromise[0].status === 'fulfilled') {
            setManualSignOut(true)
        }  
    }

    return (
        <>
            <section className="bg-[#F6F7F9] w-full h-[150vh]" style={{ position: errorScreen.state ? 'fixed' : 'static' }}>

                <div className="absolute w-full h-[100vh] backdrop-blur-md justify-center items-center" style={{ display: errorScreen.display }}>
                    <div className="w-[12rem] h-[17.5rem] text-black items-center flex gap-y-1 flex-col">
                        <Image src={images.appLogo} alt="logo" width={150} height={150} />
                        <h1 className="text-xl">{errorScreen.message}</h1>

                        <Link href={errorScreen.url} className="bg-[#40C057] w-[65%] h-[2rem] flex justify-center items-center mt-8 rounded-lg hover:brightness-90 active:scale-90">Log In</Link>
                    </div>
                </div>

                <div className="absolute left-[43.5%] w-[15rem] h-[2rem] bg-[#3D3D3D] rounded-lg pl-2 flex items-center text-white transition-all duration-200"
                    style={{ top: alert.top }}>
                    <Image src={alert?.image} alt="image" />
                    <h1 className="px-2">|</h1>
                    <h1>{alert.message}</h1>
                </div>

                <div className="bg-[#1A73E8] h-[30%] flex">
                    {
                        backgroundSvgs.map((svg: backgroundTypes) => {
                            return <BackgroundSvg key={svg.key} svgProps={svg} />
                        })
                    }
                </div>

                <div className="w-full flex items-center flex-col -mt-[26rem]">
                    <h1 className="text-white text-5xl mt-24">Welcome Back {designAndUserData.currentUserData.username}</h1>

                    <div className="max-w-[66rem] my-[6rem] flex gap-y-12 gap-x-12 flex-wrap ">
                        <div className="bg-white rounded-lg shadow-xl h-[15rem] w-[20rem] flex justify-center items-center cursor-pointer" id="doc"
                            onClick={async () => {
                                const addResult = await updateDesign(currentUserId, 'add', '', '')

                                if (addResult?.type === 'FirebaseError') {
                                    setErrorScreen({ display: 'flex', message: 'Log In To Make Changes', url: '/logIn', state: true })
                                } else {
                                    setAlert({ message: addResult?.message, image: addResult?.image, top: '1.25rem' })
                                }
                            }}>

                            <div className="flex flex-col items-center text-[#1A73E8] gap-y-8 mt-8">
                                <Image src={images.addDoc} alt="addDoc" />
                                <h1>Add New Design</h1>
                            </div>
                        </div>

                        {
                            designAndUserData.designData.map((docCard: any) => {
                                return <DocumentCard key={docCard.docId} userId={currentUserId} docId={docCard.docId} docName={docCard.docName} alert={(alert: alertTypes) => {setAlert(alert)}} />
                            })
                        }
                    </div>

                    <hr className="bg-[#969393] w-[50rem] h-[2px]" />

                    <div className="h-[20rem] w-[40rem] flex mt-[6rem] ">
                        {
                            designAndUserData.currentUserData.username.length <= 0 ? (
                                <div className="w-full h-full flex justify-center items-center">
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    <div className="pl-10 pr-14 flex flex-col justify-evenly items-center">
                                        <div className="w-[10rem] h-[10rem] rounded-full bg-white flex justify-center items-center shadow-lg">
                                            <Image src={images.userProfile} alt="userProfile" />
                                        </div>
                                    
                                        <div className="pl-2 text-[#737373] flex flex-col text-xl">
                                            <h1>{designAndUserData.currentUserData.username}</h1>
                                            <h1>{designAndUserData.currentUserData.email}</h1>
                                        </div>
                                    </div>

                                    <hr className="bg-[#969393] w-[2px] h-[20rem] mr-14" />

                                    <div className="h-full flex items-center">
                                        <div className="flex flex-col h-[11rem] justify-evenly">
                                            <Link href={`/profile/${currentUserId}=${designAndUserData.currentUserData.username}`} className="userButton bg-white flex justify-center items-center">Show Profile</Link>
                                            <button className="userButton bg-white" onClick={userSignOut}>Sign Out</button>
                                            <Link className="userButton bg-[#FA5252] flex justify-center items-center" href="/logIn/delete">Delete</Link>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </section>
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
                    <Image src={images.docRemove} alt="docRemove" onClick={async () => {
                        const deleteResult = await updateDesign(props.userId, 'remove', props.docId, '')
                        props.alert({ message: deleteResult?.message, image: deleteResult?.image, top: '1.25rem' })
                    }} />
                </div>
            </div>
        </div>
    )
}

function BackgroundSvg({ svgProps }: svgPropType) {
    const { image, flexPos, padLeft, padTop, padBottom } = svgProps || {}

    return (
        <div className="flex flex-col" style={{
            justifyContent: flexPos, paddingLeft: padLeft, 
            paddingTop: padTop, paddingBottom: padBottom
        }}>
            <Image src={image} alt="svgImage" />
        </div>
    )
}

export default UserDashboard
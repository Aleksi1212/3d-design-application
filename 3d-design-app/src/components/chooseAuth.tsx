'use client';

import Link from "next/link"
import Image from "next/image"

import email from '../images/email.png'
import google from '../images/google.png'
import github from '../images/github.png'
import facebook from '../images/facebook.png'
import back from '../images/back.png'

import { useRouter } from "next/navigation"

import { auth } from "../datalayer/config"
import { checkUser, cookieSetter } from "../datalayer/querys";

import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth"

import { useState } from "react";

function ChooseAuth(props: any) {
    const router = useRouter()

    const googleProvider = new GoogleAuthProvider()
    const githubprovider = new GithubAuthProvider()
    const facebookProvider = new FacebookAuthProvider()

    const [loading, setLoading] = useState(false)

    // console.log(loading)

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const setCookiePromise = await Promise.allSettled([
                cookieSetter(true, user.uid)
            ])

            if (setCookiePromise[0].status === 'fulfilled') {
                console.log('signed in')
                router.push(`/dashboard/${user.uid}`)
                // setLoading(false)
            }
        } else {
            setLoading(false)
        }
    })

    async function Auth(provider: any, method: string) {
        const user = auth.currentUser

        if (user && props.method === '/signUp') {
            signOut(auth)
            .then(() => {
                console.log(`signed out with id: ${user.uid}`);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user
            const userName = user.email?.split('@')[0]
            checkUser(user.uid, userName as string, user.email as string, method)
            setLoading(true)
        })
        .catch((err) => {
            console.log(err);
        })

        // auth.onAuthStateChanged(async (user) => {
        //     if (user) {
        //         const setCookie = await cookieSetter(true, user.uid)

        //         if (setCookie === 'cookie set') {
        //             router.push(`/dashboard/${user.uid}`)
        //         }

        //     } else {
        //         const setCookie = await cookieSetter(false, null)

        //         if (setCookie === 'cookie set') {
        //             router.push(`/${props.method}`)
        //         }
        //     }
        // })
    }

    // if (loading) {
    //     return (
    //         <section className="bg-[#2D2D2D] w-full h-[100vh] flex items-center justify-center">
    //             <div className="loader"></div>
    //         </section>
    //     )
    // }

    return (
        <section className="w-full h-[100vh] bg-[#2D2D2D] flex justify-center text-white">
            <div className="goBack">
                <Link href="/" className="w-full flex">
                    <Image src={back} alt="back" id="link" />
                    <span className="pl-2 pt-[1px]">Start</span>
                </Link>
            </div>

            <div className="bg-[#3D3D3D] w-[25rem] h-[30rem] relative mt-52 shadow-lg rounded-xl">
                <h1 className="formHeader text-2xl">{props.header}</h1>

                <div className="w-[25rem] h-[20rem] absolute bottom-12 flex flex-col justify-evenly items-center">
                    <Link href={`/${props.method}/email`} className="logInButton flex justify-center items-center">
                        <Image src={email} alt="email" className="buttonImage" width={25} height={25} />
                        <span className="buttonText text-center">{props.buttons.email}</span>
                    </Link>

                    <button className="logInButton" onClick={() => Auth(googleProvider, 'google')}>
                        <Image src={google} alt="google" className="buttonImage"/>
                        <span className="buttonText">{props.buttons.google}</span>
                    </button>

                    <button className="logInButton" onClick={() => Auth(githubprovider, 'github')}>
                        <Image src={github} alt="github" className="buttonImage" />
                        <span className="buttonText">{props.buttons.github}</span>
                    </button>

                    <button className="logInButton" onClick={() => Auth(facebookProvider, 'facebook')}>
                        <Image src={facebook} alt="facebook" className="buttonImage" />
                        <span className="buttonText">{props.buttons.facebook}</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChooseAuth
'use client';

import Link from "next/link"
import Image from "next/image"

import email from '../images/email.png'
import google from '../images/google.png'
import github from '../images/github.png'
import facebook from '../images/facebook.png'
import back from '../images/back.png'

import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie";

import { auth, db } from "../datalayer/config"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { checkUser } from "../datalayer/querys";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

function ChooseAuth(props: any) {
    const router = useRouter()
    const [cookie, setCookie] = useCookies(['auth'])

    const googleProvider = new GoogleAuthProvider()

    async function googleAuth() {
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user
            const userName = user.email?.split('@')[0]
            checkUser({ userId: user.uid, userName: userName, userEmail: user.email })

            // router.push(`/dashboard/${user.uid}`)
        })
        .catch((err) => {
            console.log(err);
            // router.push(`/${props.method}`)
        })

        auth.onAuthStateChanged(user => {
            if (user) {
                setCookie('auth', true)
                
            } else {
                setCookie('auth', false)
            }
        })
    }    

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

                    <button className="logInButton" onClick={googleAuth}>
                        <Image src={google} alt="google" className="buttonImage"/>
                        <span className="buttonText">{props.buttons.google}</span>
                    </button>

                    <button className="logInButton">
                        <Image src={github} alt="github" className="buttonImage" />
                        <span className="buttonText">{props.buttons.github}</span>
                    </button>

                    <button className="logInButton">
                        <Image src={facebook} alt="facebook" className="buttonImage" />
                        <span className="buttonText">{props.buttons.facebook}</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChooseAuth
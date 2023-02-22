'use client';

import Link from "next/link"
import Image from "next/image"

import images from "../functions/importImages";

import { useRouter } from "next/navigation"

import { auth } from "../datalayer/config"
import { checkUser, cookieSetter } from "../datalayer/querys";

import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth"

function AuthBox(props: any) {
    const router = useRouter()

    const googleProvider = new GoogleAuthProvider()
    const githubprovider = new GithubAuthProvider()
    const facebookProvider = new FacebookAuthProvider()

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const setCookiePromise = await Promise.allSettled([
                cookieSetter(true, user.uid)
            ])

            if (setCookiePromise[0].status === 'fulfilled') {
                router.push(`/dashboard/${user.uid}`)
            }
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
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className="w-[25rem] h-[30rem] relative flex flex-col shadow-xl rounded-xl text-[#4D4D4D]" style={{ marginTop: props.styles.marginTop, backgroundColor: props.styles.color }}>
            <h1 className="formHeader text-2xl">{props.header}</h1>

            <div className="w-[25rem] h-[20rem] absolute bottom-12 flex flex-col justify-evenly items-center">
                <Link href={`/${props.method}/email`} className="logInButton flex justify-center items-center">
                    <Image src={images.email} alt="email" className="buttonImage" width={25} height={25} />
                    <span className="buttonText text-center">{props.buttons.email}</span>
                </Link>

                <button className="logInButton" onClick={() => Auth(googleProvider, 'google')}>
                    <Image src={images.google} alt="google" className="buttonImage"/>
                    <span className="buttonText">{props.buttons.google}</span>
                </button>

                <button className="logInButton" onClick={() => Auth(githubprovider, 'github')}>
                    <Image src={images.github} alt="github" className="buttonImage" />
                    <span className="buttonText">{props.buttons.github}</span>
                </button>

                <button className="logInButton" onClick={() => Auth(facebookProvider, 'facebook')}>
                    <Image src={images.facebook} alt="facebook" className="buttonImage" />
                    <span className="buttonText">{props.buttons.facebook}</span>
                </button>
            </div>
        </div>
    )
}

export default AuthBox
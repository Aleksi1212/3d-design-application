'use client'

import Image from "next/image"
import Link from "next/link"

import back from '../../../src/images/back.png'
import email from '../../../src/images/email.png'
import google from '../../../src/images/google.png'
import github from '../../../src/images/github.png'
import facebook from '../../../src/images/facebook.png'

import { auth, db } from "../../../src/datalayer/config"
import { deleteUser, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth"
import { deleteDoc, doc, where, collection, getDocs, query } from "firebase/firestore"

import { cookieSetter } from "../../../src/datalayer/otherFunctionality"
import { useRouter } from 'next/navigation'

function ReAuth() {
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()
    const facebookProvider = new FacebookAuthProvider()

    const router = useRouter()

    async function reAuth(provider: any) {
        const user: any = auth.currentUser

        reauthenticateWithPopup(user, provider)
        .then((result) => {
            const userData = result.user
            console.log('user', userData.uid);

            deleteUser(userData)
            .then(async () => {
                console.log('user deleted');
                
                const que = query(collection(db, 'data'), where('userId', '==', userData.uid))
                const querySnapshot = await getDocs(que)
                const docId = querySnapshot.docs.map((doc) => doc.id)

                await deleteDoc(doc(db, 'data', docId[0]))
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err);
        })

        auth.onAuthStateChanged(async (user) => {
            if (!user) {
                await cookieSetter(false, null)
                router.push('/')
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
                <h1 className="formHeader text-2xl">Verify User</h1>

                <div className="w-[25rem] h-[20rem] absolute bottom-12 flex flex-col justify-evenly items-center">
                    <Link href='/logIn/delete/email' className="logInButton flex justify-center items-center">
                        <Image src={email} alt="email" className="buttonImage" width={25} height={25} />
                        <span className="buttonText text-center">Verify With Email</span>
                    </Link>

                    <button className="logInButton" onClick={() => reAuth(googleProvider)} >
                        <Image src={google} alt="google" className="buttonImage"/>
                        <span className="buttonText">Verify With Google</span>
                    </button>

                    <button className="logInButton" onClick={() => reAuth(githubProvider)}>
                        <Image src={github} alt="github" className="buttonImage" />
                        <span className="buttonText">Verify With GitHub</span>
                    </button>

                    <button className="logInButton" onClick={() => reAuth(facebookProvider)}>
                        <Image src={facebook} alt="facebook" className="buttonImage" />
                        <span className="buttonText">Verify With Facebook</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ReAuth
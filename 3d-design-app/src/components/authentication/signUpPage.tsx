'use client';

import { useState } from "react";
import useInputStyles from "../../hooks/inputStylehook";

import Image from "next/image";
import Link from "next/link";

import images from "../../functions/importImages";

import { auth } from "../../datalayer/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import checkUser from "../../datalayer/firestoreFunctions/checkUser";

import Loader from "../styledComponents/loader";

function SignUp() {
    const [inputType, setInputType] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [emailFieldStyles, setEmailFieldStyles] = useInputStyles({ inputVal: '', placeholder: false, isUp: false }) as any
    const [usernameFieldStyles, setUsernameFieldStyles] = useInputStyles({ inputVal: '', placeholder: false, isUp: false }) as any
    const [passwordFieldStyles, setPasswordFieldStyles] = useInputStyles({ inputVal: '', placeholder: false, isUp: false }) as any

    async function signUp(event: any) {
        event.preventDefault()

        const userData = {
            email: event.target.email.value,
            username: event.target.username.value,
            password: event.target.password.value,
        }

        createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredentials) => {
                const user = userCredentials.user
            
                checkUser(user.uid, userData.username, userData.email, 'email')
                setLoading(true)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <section className="w-full h-[100vh] bg-[#F6F7F9] flex justify-center">
                <div className="goBack">
                    <Link href="/" className="w-full flex">
                        <Image src={images.back} alt="back" id="link" />
                        <span className="pl-2 pt-[1px] text-[#3D3D3D]">Start</span>
                    </Link>
                </div>

                <div className="bg-white w-[25rem] h-[35rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Sign Up</h1>

                    <div className="formContainer h-96">
                        <form className="form" onSubmit={signUp}>
                            <div className="flex relative">
                                <input type="text" className="input" name="email" required
                                onClick={() => setEmailFieldStyles({ payload: { inputVal: emailFieldStyles.inputVal, placeholder: true, isUp: true } })}
                                onBlur={() => setEmailFieldStyles({ payload: { inputVal: emailFieldStyles.inputVal, placeholder: false, isUp: false } })}
                                onChange={(event: any) => setEmailFieldStyles({ payload: { inputVal: event.target.value, placeholder: false, isUp: false } })}
                                />

                                <span className="placeholder" style={
                                    emailFieldStyles.placeholder ? 
                                    { bottom: '2rem', left: '.25rem', opacity: '.6' } : 
                                    { bottom: '.5rem', left: '.5rem', opacity: '.75'}
                                }>Email Address</span>
                            </div>

                            <div className="flex relative">
                                <input type="text" className="input" name="username" required
                                onClick={() => setUsernameFieldStyles({ payload: { inputVal: usernameFieldStyles.inputVal, placeholder: true, isUp: true } })}
                                onBlur={() => setUsernameFieldStyles({ payload: { inputVal: usernameFieldStyles.inputVal, placeholder: false, isUp: false } })}
                                onChange={(event: any) => setUsernameFieldStyles({ payload: { inputVal: event.target.value, placeholder: false, isUp: false } })}
                                />
                                <span className="placeholder" style={
                                    usernameFieldStyles.placeholder ? 
                                    { bottom: '2rem', left: '.25rem', opacity: '.6' } : 
                                    { bottom: '.5rem', left: '.5rem', opacity: '.75'}
                                }>Username</span>
                            </div>

                            <div className="flex relative">
                                <input type={inputType ? 'text' : 'password'} className="input" name="password" required
                                onClick={() => setPasswordFieldStyles({ payload: { inputVal: passwordFieldStyles.inputVal, placeholder: true, isUp: true } })}
                                onBlur={() => setPasswordFieldStyles({ payload: { inputVal: passwordFieldStyles.inputVal, placeholder: false, isUp: false } })}
                                onChange={(event: any) => setPasswordFieldStyles({ payload: { inputVal: event.target.value, placeholder: false, isUp: false } })}
                                />

                                <div className="absolute h-full right-2 flex flex-col justify-center pt-2">
                                    <Image src={inputType ? images.hide : images.show} alt="image" id="showHide" onClick={() => setInputType(!inputType)} className="cursor-pointer" />
                                    <div id="showHideBox" className="w-[9rem] flex justify-center absolute bg-[#3D3D3D] rounded-md right-[-10rem] top-4 text-white transition-all duration-200 origin-left scale-0">
                                        {inputType ? 'Hide Password' : 'Show Password'}
                                    </div>
                                </div>

                                <span className="placeholder" style={
                                    passwordFieldStyles.placeholder ? 
                                    { bottom: '2rem', left: '.25rem', opacity: '.6' } : 
                                    { bottom: '.5rem', left: '.5rem', opacity: '.75'}
                                }>Password</span>
                            </div>

                            <button className="logInButton" type="submit">
                                <Image src={images.logIn} alt="signUp" className="buttonImage" />
                                <span className="buttonText">Sign Up</span>
                            </button>
                        </form>
                    </div>

                    <div className="w-full flex justify-start pl-10 bottom-2 absolute">
                        <Link href="/logIn" className="text-[#3D8ED9]" id="link">Already Have An Account</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp
import AuthBox from "../../src/components/authenticationBox"

import Link from 'next/link'
import Image from "next/image"

import images from "../../src/functions/importImages"


export default function LogInButtons() {
    return (
        <section className="w-full h-[100vh] bg-[#F6F7F9] flex justify-center">
            <div className="goBack">
                <Link href="/" className="w-full flex">
                    <Image src={images.back} alt="back" id="link" />
                    <span className="pl-2 pt-[1px] text-[#3D3D3D]">Start</span>
                </Link>
            </div>

            <AuthBox method={'logIn'} header={'Choose Log In Method'} styles={{ marginTop: '13rem', color: 'white' }} buttons={{
                email: 'Log In With Email',
                google: 'Log In With Google',
                github: 'Log In With GitHub',
                facebook: 'Log In With FaceBook'
            }} />
        </section>
    )
}
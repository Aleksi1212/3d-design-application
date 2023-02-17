import AuthBox from "../../src/components/authenticationBox";

import Link from 'next/link'
import Image from 'next/image'

import images from "../../src/functions/importImages";

export default function SignUpButtons() {
    return (
        <section className="w-full h-[100vh] bg-[#F6F7F9] flex justify-center">
            <div className="goBack">
                <Link href="/" className="w-full flex">
                    <Image src={images.back} alt="back" id="link" />
                    <span className="pl-2 pt-[1px] text-[#3D3D3D]">Start</span>
                </Link>
            </div>

            <AuthBox method={'signUp'} header={'Sign Up'} styles={{ marginTop: '13rem', color: 'white' }} buttons={{
                email: 'Sign Up With Email',
                google: 'Sign Up With Google',
                github: 'Sign Up With GitHub',
                facebook: 'Sign Up With Facebook'
            }} />
        </section>
    )
}
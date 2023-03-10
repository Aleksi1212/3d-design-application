'use client';

import Image from "next/image";

interface stylesTypes {
    dimensions: string
    backgroundColor: string
    bold: boolean
    userName: string
    info: string
    profileImage: any
    profileUrl: string
}

interface styles {
    styles: stylesTypes
}

function ProfileBox({ styles }: styles) {
    const { dimensions, backgroundColor, bold, userName, info, profileImage, profileUrl } = styles || {}

    return (
        <>
            <div className="shadow-md flex justify-center items-center rounded-full overflow-hidden" style={{
                width: dimensions,
                height: dimensions,
                backgroundColor: backgroundColor
            }}>
                {
                    profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                        <h1>{profileImage.profileImage}</h1>
                    ) : (
                        <Image src={profileImage.profileImage} alt="profileImage" width={500} height={500}
                        style={{
                            objectFit: 'cover',
                            width: profileUrl === 'profileImages/defaultProfile.png' || profileUrl === '' ? '40%' : '100%',
                            height: profileUrl === 'profileImages/defaultProfile.png' || profileUrl === '' ? '40%' : '100%',
                        }} />
                    )
                }
            </div>

            <div className="flex flex-col justify-center">
                <h1 className={bold ? 'font-semibold' : 'text-lg'}>{userName}</h1>
                <p className="text-xs opacity-60">{info}</p>
            </div>
        </>
    )
}

export default ProfileBox
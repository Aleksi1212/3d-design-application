import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'firebase/auth'
import { auth } from './config'


async function logIn(data: any) {

    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
            const user = userCredential.user

            const relevantData = {
                username: data.name,
                userId: user.uid,
                email: user.email,
                documents: []
            }

            await fetch('http://localhost:3000/api/logIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(relevantData)
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

async function signUp(data: object) {
    const res = await fetch('http://localhost:3000/api/signUp', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return res.json()
}

export {
    logIn,
    signUp
}

import { collection, addDoc, getDocs } from "firebase/firestore";
import { database } from './config'

async function test() {
    const query = getDocs(collection(database, 'data'))
    const querySnapshot = query
    const data = (await querySnapshot).docs.map((doc) => doc.data())

    return data
}

// async function test() {
//     const querySnapshot = await getDocs(collection(database, 'data'))

//     querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//     })
// }

export default test
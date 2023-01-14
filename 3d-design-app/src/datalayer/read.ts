import { strict } from "assert";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

// export interface Item {
//     id: string
//     data: object
// }

// export interface Props {
//     data: Item[]
// }


async function Get() {
    const querySnapshots = await getDocs(collection(db, 'data'))
    // const data: Item[] = querySnapshots.docs.map((doc) => ({id: doc.id, data: doc.data()}))

    // return { props: { data } }
    const data = querySnapshots.docs.map((doc) => doc.data())

    return data
}

export default Get
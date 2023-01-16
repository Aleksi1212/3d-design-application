import UserHome from "../../../src/components/userHome";
import getUserData from "../../../src/datalayer/getUserData";

async function UserHomePage({ params }: any) {
    const test = await getUserData({ userId: params.id })
    test?.map((card) => {
        console.log(card.email);
    })

    return (
        <UserHome />
    )
}


export default UserHomePage
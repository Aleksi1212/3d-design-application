import ChooseAuth from "../../src/components/chooseAuth"


export default function LogInButtons() {
    return (
        <ChooseAuth method={'logIn'} header={'Choose Log In Method'} buttons={{
            email: 'Log In With Email',
            google: 'Log In With Google',
            github: 'Log In With GitHub',
            facebook: 'Log In With FaceBook'
        }} />
    )
}
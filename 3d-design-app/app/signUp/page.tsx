import ChooseAuth from "../../src/components/chooseAuth";

export default function SignUpButtons() {
    return (
        <ChooseAuth method={'signUp'} header={'Sign Up'} buttons={{
            email: 'Sign Up With Email',
            google: 'Sign Up With Google',
            github: 'Sign Up With GitHub',
            facebook: 'Sign Up With Facebook'
        }} />
    )
}
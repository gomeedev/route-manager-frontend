import CustomMeta from "../../components/customMeta/CustomMeta"
import AuthLayout from "../../layout/authLayout/AuthPageLayout"
import { SignInForm } from "../../components/auth/SignInForm"


export const SignInPage = () => {
    return (
        <>
            <CustomMeta />
            <AuthLayout>
                < SignInForm />
            </AuthLayout>
        </>
    )
}
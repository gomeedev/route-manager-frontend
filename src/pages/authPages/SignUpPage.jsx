import CustomMeta from "../../components/common/CustomMeta"
import AuthLayout from "../../layout/authLayout/AuthLayout";
import { SignUpForm } from "../../components/auth/SignUpForm";


export const SignUpPage = () => {
    return (
        <>
            <CustomMeta />
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </>
    );
}
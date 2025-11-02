import CustomMeta from "../../components/customMeta/CustomMeta";
import AuthLayout from "../../layout/authLayout/AuthPageLayout";
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
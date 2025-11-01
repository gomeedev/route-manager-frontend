import react, { useState } from "react"
import CustomMeta from "../../components/customMeta/CustomMeta";



export const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    return (
        <>
            <CustomMeta />
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </>
    );
}
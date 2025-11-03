import React from "react"
import CustomMeta from "../../components/customMeta/CustomMeta"
import AuthLayout from "../../layout/authLayout/AuthPageLayout"
import { ResetPasswordRequestForm } from "../../components/auth/ResetPasswordRequestForm"



export const ResetPasswordRequestPage = () => {
    return (
        <>
            <CustomMeta />
            <AuthLayout>
                < ResetPasswordRequestForm />
            </AuthLayout>
        </>
    )
}

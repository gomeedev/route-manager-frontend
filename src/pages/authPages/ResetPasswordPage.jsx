import React from "react"
import CustomMeta from "../../components/common/CustomMeta"
import AuthLayout from "../../layout/authLayout/AuthLayout"
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm"


export const ResetPasswordPage = () => {
    return (
        <>
            <CustomMeta />
            <AuthLayout>
                < ResetPasswordForm />
            </AuthLayout>
        </>
    )
}

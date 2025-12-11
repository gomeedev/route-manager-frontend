// Servicios
import { useState } from "react"
import { supabase } from "../../global/supabase/supabaseClient"

import { Link } from "react-router-dom"
// Componentes
import Input from "../form/input/InputField"


export const ResetPasswordRequestForm = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        const redirectTo = import.meta.env.DEV ? "http://localhost:5173/reset-password-form" : "https://route-manager-frontend.vercel.app/reset-password-form"
        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo
            }
        )

        if (error) {
            setMessage(error.message)
        } else {
            setMessage("Te enviamos un correo de recuperacion a tu gmail");
            setEmail("")

            setTimeout(() => {
                setMessage("")
            }, 10000);

        }
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Introduzca su correo para recibir un enlace para restablecer su contraseña.
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Correo <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="info@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {message &&
                                    <div className="mb-4 p-3 text-sm border rounded-lg text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                        {message}
                                    </div>}

                                <div>
                                    <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Enviar correo
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                ¿Ya recuerda su contraseña?{" "}
                                <Link
                                    to="/signin"
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-500"
                                >
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
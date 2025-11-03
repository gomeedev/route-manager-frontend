import { useState } from "react"
import { supabase } from "../../supabase/supabaseClient"
import { useNavigate } from "react-router-dom"

import { Eye, EyeOff } from "lucide-react"
import Input from "../form/input/InputField"

export const ResetPasswordForm = () => {



    // Estados para campos
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")

    const navigate = useNavigate();

    // Estado para iconos
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const handleReset = async (event) => {
        event.preventDefault()

        if (password !== passwordConfirm) {
            setMessage("Las contraseñas no coinciden")
            return
        }

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setMessage(error.message)
            setMessageType("error")
        } else {
            setMessage("Contraseña actualizada")
            setMessageType("success")
            setPassword("")
            setPasswordConfirm("")

            setTimeout(() => {
                navigate("/signin");
            }, 2000)
        }
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Restablecer contraseña
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Asegurese de introducir una contraseña facil de recordar
                        </p>
                    </div>

                    {message && (
                        <div
                            className={`mb-4 p-3 text-sm border rounded-lg ${messageType === "error"
                                ? "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                : "text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    <div>
                        <form onSubmit={handleReset} >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Contraseña <span className="text-error-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nueva contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <Eye className="text-gray-500 size-4" />
                                            ) : (
                                                <EyeOff className="text-gray-500 size-4" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Repetir contraseña <span className="text-error-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswordConfirm ? "text" : "password"}
                                            placeholder="Confirmar contraseña"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPasswordConfirm ? (
                                                <Eye className="text-gray-500 size-4" />
                                            ) : (
                                                <EyeOff className="text-gray-500 size-4" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600"
                                    >
                                        Recuperar contraseña
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

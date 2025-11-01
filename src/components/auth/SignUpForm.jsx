import react, { useState } from "react"
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";


export const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Volver al inicio
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Registrarse
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Complete los datos para registrarse como conductor
                        </p>
                    </div>

                    <div>
                        <form action="">
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <label>
                                            Correo<span className="text-error-500">*</span>
                                        </label>
                                        <input type="email" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label>
                                            Contraseña <span className="text-error-500">*</span>
                                        </label>
                                        <input type="password" />
                                    </div>
                                    <div>
                                        <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                            Registrarme
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5 mb-4">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                ¿Ya tienes cuenta?{" "}
                                <Link
                                    to="/signin"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Iniciar Sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
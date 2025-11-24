import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

// Servicios
import { SigninUserSupabase, SigninUserDjango } from "../../global/api/UsersService";

import { Eye, EyeOff } from "lucide-react";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/CheckBox"




export const SignInForm = () => {

    // Estados Para el formulario 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Instancia de useNavigate
    const navigate = useNavigate();

    // Estado para ver la contraseña
    const [showPassword, setShowPassword] = useState(false)

    // Estado para mantener (o no) la actividad
    const [isChecked, setIsChecked] = useState(false);



    const handleSubmit = async (event) => {
        // Hace que no recargue la pagina despues de oprimir el botón
        event.preventDefault()
        setMessage("");

        let data;
        let token;

        try {
            data = await SigninUserSupabase(email, password)
            token = data.session.access_token;

        } catch (error) {
            setMessage(error.message)
            setEmail("")
            setPassword("")
            return
        }


        if (data) {

            // local es persistente aunque cierre el navegador
            localStorage.setItem("token", token);


            try {
                
                // Obtengo a mi usuario
                const user = await SigninUserDjango();
                // LocalStorage lo uso para usar esa info en otras partes de la aplicación
                localStorage.setItem("user", JSON.stringify(user));


                const rol = user.rol_nombre;
                localStorage.setItem("rol", rol);


                if (rol == "admin") {
                    navigate("/admin");
                } else if (rol == "driver") {
                    navigate("/driver")
                } else {
                    setMessage("No tienes acceso crack")
                }

            } catch (error) {
                setMessage("Algo esta mal en lo que ingresas mi bro");
            }
        }

    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Iniciar Sesión
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ingresa tu correo y contraseña para iniciar sesión
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
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        placeholder="Ingresa tu correo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Contraseña <span className="text-error-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Ingresa tu contraseña"
                                            required
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <Eye className="text-gray-500 dark:text-gray-400 size-4" />
                                            ) : (
                                                <EyeOff className="text-gray-500 dark:text-gray-400 size-4" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/** Mensaje de error */}
                                {message &&
                                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                        {message}
                                    </div>}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isChecked} onChange={setIsChecked} />
                                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Mantenerme conectado
                                        </span>
                                    </div>
                                    <Link
                                        to="/reset-password"
                                        className="text-sm text-blue-600 hover:text-blue-600 dark:text-blue-400"
                                    >
                                        ¿Olvidó su contraseña?
                                    </Link>
                                </div>

                                <div>
                                    <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Iniciar sesión
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/signup"
                                    className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
                                >
                                    Registrarse
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}
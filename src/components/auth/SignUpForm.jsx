import react, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

// Servicios
import { supabase } from "../../supabase/supabaseClient";
import { API_URL } from "../../global/config/api";
import axios from "axios";

import { ChevronLeft } from "lucide-react";
import Input from "../form/input/InputField";
import Select from "../form/input/Select";




export const SignUpForm = () => {

    // Estados Para el formulario 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono_movil, setTelefono_movil] = useState("")
    const [tipo_documento, setTipoDocumento] = useState("")
    const [documento, setDocumento] = useState("")
    // Estado para los mensajes y tipos de mensajes
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // Instancia de useNavigate
    const navigate = useNavigate();


    const opcionestipoDocumento = [
        { value: "CC", label: "Cédula de ciudadanía" },
        { value: "CE", label: "Cédula de extranjería" },
        { value: "TI", label: "Tarjeta de identidad" },
    ]


    const handleSubmit = async (event) => {

        // Hace que no recargue la pagina despues de oprimir el botón
        event.preventDefault()
        // Mensaje vacio inicialmente
        setMessage("");
        setMessageType("");

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            setMessage(error.message);
            setMessageType("error");
            return
        }

        if (data && data.session) {
            const token = data.session.access_token

            try {
                await axios.post(`${API_URL}/api/v1/signup/`, {
                    nombre,
                    apellido,
                    telefono_movil,
                    documento,
                    tipo_documento,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });


                setMessage("Conductor creado correctamente");
                setMessageType("success")

                setTimeout(() => {
                    navigate("/signin")
                }, 5000);

            } catch (err) {
                setMessage(err.response?.data?.error || "Error al crear usuario mi bro");
                setMessageType("error")
            }

        }

        // Vaciamos el formulario despues de oprimir el botón
        setNombre("")
        setApellido("")
        setTipoDocumento("")
        setDocumento("")
        setTelefono_movil("")
        setEmail("")
        setPassword("")
    };


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

                    {/** Mensaje de error */}
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
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    {/* Valores enviados a django */}
                                    <div className="sm:col-span-1">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Nombre <span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setNombre(e.target.value)}
                                            value={nombre}
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Apellido <span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setApellido(e.target.value)}
                                            value={apellido}
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Tipo documento <span className="text-error-500">*</span>
                                        </label>
                                        <Select
                                            placeholder="Seleciona tu tipo de documento"
                                            defaultValue={tipo_documento}
                                            onChange={(value) => setTipoDocumento(value)}
                                            options={opcionestipoDocumento.slice(0)}
                                            className={"block text-[15px] mb-2 text-gray-700 dark:text-gray-400"}
                                        >
                                        </Select>
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Documento <span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setDocumento(e.target.value)}
                                            value={documento}
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Telefono <span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setTelefono_movil(e.target.value)}
                                            value={telefono_movil}
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Correo<span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            type="email"
                                            placeholder="Ingresa tu correo"
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Contraseña <span className="text-error-500">*</span>
                                        </label>
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            type="password"
                                            placeholder="Ingresa tu contraseña  "
                                            required
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                            Registrarse
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
                                    className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
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
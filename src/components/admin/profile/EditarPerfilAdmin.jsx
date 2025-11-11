import { useState } from "react";
import { EditProfileUser } from "../../../global/api/UsersService";
import { toast } from "sonner";


export const EditarPerfilAdmin = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    const [photo, setPhoto] = useState(user.foto_perfil || "")
    const [email, setEmail] = useState(user.correo || "")
    const [phone, setPhone] = useState(user.telefono_movil || "")


    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData();

        if (photo && typeof photo !== "string") {
            formData.append("foto", photo)
        }

        formData.append("correo", email)
        formData.append("telefono_movil", phone)


        try {

            const updateUser = await EditProfileUser(user.id_usuario, formData);

            localStorage.setItem("user", JSON.stringify(updateUser))
            setUser(updateUser)

            toast.success("Datos del perfil actualizados")

            setTimeout(() => {
                window.location.reload()
            }, 2000);

        } catch (error) {
            toast.error("Error al actualizar el perfil")

        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {photo && typeof photo === "string" && (
                    <img src={photo} alt="Foto actual" width={100} />
                )}
                {photo && typeof photo !== "string" && (
                    <img src={URL.createObjectURL(photo)} alt="Nueva foto" width={100} />
                )}


                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo"
                />
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                />

                <button type="submit">Guardar cambios</button>
            </form>
        </>

    )

}


export const MostrarPerfilDriver = () => {

    let user = JSON.parse(localStorage.getItem("user"))

    switch (user.tipo_documento) {
        case "CC":
            user.tipo_documento = "Cédula de ciudadania"
            break
        case "TI":
            user.tipo_documento =  "Tarjeta de identidad"
        case "CE":
            user.tipo_documento =  "Cédula de extranjeria"
            break
    }

    return (
        <>
            <p>Perteneces a la empresa <i>{user.empresa_nombre}</i></p> <br />
            <img src={user.foto_perfil} alt="Foto de perfil" className="rounded-[50%] w-[100px] h-[100px]" />
            <p>Ultima actualización: <i>{user.fecha_actualizacion_foto}</i></p>
            <p>Estado: <i>{user.estado}</i></p>
            <p>Rol: <i>{user.rol_nombre}</i></p> <br />
            <p>Nombre: <i>{user.nombre}</i></p>
            <p>Apellido: <i>{user.apellido}</i></p>
            <p>Tipo de Documento: <i>{user.tipo_documento}</i></p>
            <p>Numero de Documento: <i>{user.documento}</i></p>
            <p>Correo:<i>{user.correo}</i></p>
            <p>Telefono:<i>{user.telefono_movil}</i></p>

        </>
    )
}

import { Children, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const EspecialistaContext = createContext()

export const EspecialistaProvider = ({children}) =>{

    const {user, setUser} = useContext(AuthContext)
    const [especialistas, setEspecialistas] = useState([])

    const fetchEspecialistas = async () => {
        try {
            const respuesta = await fetch('https://672a9869976a834dd023dd5f.mockapi.io/Especialistas')
            const data = await respuesta.json()
            setEspecialistas(data)
        } catch (error) {
            console.error("Error en el fetch: ", error)
        }
    }

    useEffect(() => {
        fetchEspecialistas()
    }, [])

    const cargarEspecialista = async (nuevoEspecialista) =>{

        try {
            const respuesta = await fetch('https://672a9869976a834dd023dd5f.mockapi.io/Especialistas', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(nuevoEspecialista)
            })

            if (respuesta.ok) {
                const especialistaCreado = await respuesta.json();
                setEspecialistas((prevEspecialistas) => [...prevEspecialistas, especialistaCreado])
            }else{
                alert('Error al agregar especialista')
            }
        } catch (error) {
            console.error('Erro en la carga del especialista', error)
        }
    }


    return (
        <EspecialistaContext.Provider value={{especialistas, fetchEspecialistas, cargarEspecialista}}>
            {children}
        </EspecialistaContext.Provider>
    )
}
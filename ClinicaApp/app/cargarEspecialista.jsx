import { useContext, useState } from "react";
import { EspecialistaContext } from "../context/EspecialistaContext";
import { useRouter } from "expo-router";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";

export default function cargarEspecialistaScreen(){

    const {cargarEspecialista} = useContext(EspecialistaContext)

    const router = useRouter()

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [dni, setDni] = useState('')
    const [especialidad, setEspecialidad] = useState('')

    const crearEspecialista = () =>{
        const nuevoEspecialista = {
            id: Math.random.toString(),
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            especialidad: especialidad
        }

        cargarEspecialista(nuevoEspecialista)
        router.push('/home')
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Nuevo Producto</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
            />
            <TextInput
                style={styles.input}
                placeholder="DNI"
                value={dni}
                onChangeText={setDni}
            />
            <TextInput
                style={styles.input}
                placeholder="Especialidad"
                value={especialidad}
                onChangeText={setEspecialidad}
            />
            <Button title= 'Cargar especialista' style={styles.button} onPress={crearEspecialista}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title:{
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center'
    },
    input:{
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    button:{
        marginTop: 20
    },
    image:{
        width: '100%',
        height: 200,
        marginVertical: 20
    },
    uploadContainer:{
        flexDirection: 'row',
        gap: 10, 
        marginBottom: 30
    }
})
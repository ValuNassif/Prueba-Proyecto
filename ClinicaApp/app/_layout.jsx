import { useColorScheme } from "react-native";
import { Stack } from 'expo-router';
import { TurnosProvider } from '../context/TurnosContext';
//import { AuthProvider } from '../context/AuthContext';

export default function RootLayout(){
    const colorScheme = useColorScheme();

    return (
        //<AuthProvider>
            <TurnosProvider>
                <Stack>
                    <Stack.Screen name="index" options = {{ headerShown: false }}/>
                    <Stack.Screen name="home" options = {{ headerShown: false }}/>
                    <Stack.Screen name="misTurnos" options = {{ headerTitle: "Mis Turnos" }}/>
                    <Stack.Screen name="nuevoTurno" options = {{ headerTitle: "Nuevo Turno" }}/>
                 </Stack>
             </TurnosProvider>
      //  </AuthProvider>
    )
}
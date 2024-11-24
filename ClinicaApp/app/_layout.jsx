import { useColorScheme } from "react-nativee";

export default function RootLayout(){
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options = {{ headerShown: false }}/>
        </Stack>
    )
}
import {  View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';
  import { useRouter } from 'expo-router';
  import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { EspecialistaContext } from '../context/EspecialistaContext';
import { TurnosContext } from '../context/TurnosContext';

  
  export default function HomeTabScreen() {

    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext)
    const {especialistas} = useContext(EspecialistaContext)
    const {turnos, proximos, cancelados} = useContext(TurnosContext)
    const router = useRouter();
    
    console.log('user:', user);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const respuesta = await fetch('https://674352f3b7464b1c2a646aa5.mockapi.io/api/v1/usuarios');
          const data = await respuesta.json();
          setUsers(data.results);
        } catch (error) {
          console.error('error: ', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Home Screen</Text>
  
        {user.admin ? (
          // ------Admin------
          <>
            <Button
              title="Carga Especialista"
              onPress={() => router.push('/cargaEspecialista')}
              style={styles.adminButton}
            />
            <FlatList 
            data={especialistas}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View key={item.id} style={styles.userContainer}>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                  <Text style={styles.detalle}>Especialidad : {item.especialidad} </Text>
                  <Text style={styles.detalle}>Dni : {item.dni} </Text>
                </View>
              </View>
            )}
            />
          </>
        ):(
          // ------Usuario normal------
          <>
        <Text style={styles.name}>Home Screen</Text>
        <Button
          title="Nuevo Turno"
          onPress={() => router.push('/nuevoTurno')}
        />
        <Button
          title="Mis Turnos"
          onPress={() => router.push('/(misTurnos)')}
        />
        {<FlatList
          data={proximos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Image
                source={{ uri: item.picture.large }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>Fecha: {item.fecha}</Text>
                <Text style={styles.detalle}>Hora: {item.hora}</Text>
                <Text style={styles.detalle}>
                  Médico: {especialistas && especialistas.find((especialista) => especialista.id === item.idMedico)?.nombre || 'No encontrado'}
                </Text>
              </View>
            </View>
          )}
        /> }
      </>
    )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'wheat',
      padding: 30,
    },
    spinnerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#c1bdbd',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 15,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    detalle: {
      fontSize: 16,
      color: '#666',
    },
    adminButton: {
      margin: 5,
      padding: 5,
    },
    spinner: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 4,
      borderColor: 'transparent',
      borderTopColor: '#0000ff',
      borderLeftColor: '#0000ff',
    },
  });
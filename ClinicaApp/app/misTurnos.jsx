import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { TurnosContext } from '../context/TurnosContext';

export default function MisTurnos({ navigation }) {
  const { proximos, cancelados, eliminarTurno } = useContext(TurnosContext)

  const handleEliminar = (id) => {
    Alert.alert(
      'Cancelar Turno',
      '¿Estás seguro de cancelar este turno?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: () => eliminarTurno(id) },
      ],
      { cancelable: false }
    )
  }

  const renderTurno = (turno, tipo) => (
    <View style={styles.turno}>
      <Image source={{ uri: turno.fotoDoctor }} style={styles.fotoDoctor} />
      <Text style={styles.nombreDoctor}>{turno.nombreDoctor}</Text>
      <Text>{turno.especialidad}</Text>
      {tipo === 'proximos' && (
        <View style={styles.acciones}>
          <TouchableOpacity onPress={() => navigation.navigate('NuevoTurno', { id: turno.id })}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEliminar(turno.id)}>
            <Text style={styles.icon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={[styles.listaContainer, { backgroundColor: '#cef2f9' }]}>
        <Text style={styles.titulo}>Turnos Próximos</Text>
        <FlatList
          data={proximos.slice(0, 10)} // muestra hasta 10 turnos
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderTurno(item, 'proximos')}
          horizontal
        />
      </View>

      <View style={[styles.listaContainer, { backgroundColor: '#dddddd' }]}>
        <Text style={styles.titulo}>Turnos Cancelados o Vencidos</Text>
        <FlatList
          data={cancelados.slice(0, 10)} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderTurno(item, 'cancelados')}
          horizontal
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  listaContainer: {
    width: '90%',
    height: '35%',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  turno: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  fotoDoctor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  nombreDoctor: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 8,
  },
  icon: {
    fontSize: 18,
    marginHorizontal: 8,
  }
})

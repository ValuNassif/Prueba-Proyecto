import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, StyleSheet, Object, Day, String, Set } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { EspecialistaContext } from '../context/EspecialistaContext';
import { AuthContext } from '../context/AuthContext';


export default function NuevoTurnoScreen() {

    const {user} = useContext(AuthContext)
    const {especialistas} = useContext(EspecialistaContext)

    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
    const [mostrarDoctores, setMostrarDoctores] = useState(false);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [titulo, setTitulo] = useState('Nuevo Turno');
    const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([]);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [diasHabilitados, setDiasHabilitados] = useState({});
    const [busqueda, setBusqueda] = useState('');

    const nombreDiaANumero = {
        'Domingo': 0,
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6
      };


      useEffect(() => {
        const especialidadesUnicas = [... new Set(especialistas.map(esp => esp.especialidad))]
        const especialidadesFormateadas = especialidadesUnicas.map((especialidad, index) => ({
          id: String(index + 1),
          especialidad : especialidad
        }))
        setEspecialidadesDisponibles(especialidadesFormateadas)
    
    }, [especialistas])



  const generarDiasHabilitados = (diasAtencion) => {
    const fechasHabilitadas = {};
    const hoy = new Date();
    
    for (let i = 0; i < 90; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const fechaStr = fecha.toISOString().split('T')[0];
      const diaSemana = fecha.getDay();
  
      const esDiaHabilitado = diasAtencion.some(dia => 
        nombreDiaANumero[dia] === diaSemana
      );
  
      if (esDiaHabilitado) {
        fechasHabilitadas[fechaStr] = {
          selected: false,
          marked: true,
          dotColor: '#4CAF50',
          activeOpacity: 0,
          disableTouchEvent: false
        };
      } else {
        fechasHabilitadas[fechaStr] = {
          disabled: true,
          disableTouchEvent: true,
          textColor: '#d9e1e8',
          activeOpacity: 0
        };
      }
    }
    return fechasHabilitadas;
  };

  const obtenerDoctoresPorEspecialidad = (especialidad) => {
    return especialistas
      .filter(especialista => 
        especialista.especialidad === especialidad && 
        especialista.activo
      )
      .map(especialista => ({
        id: especialista.id,
        nombre: `Dr. ${especialista.nombre} ${especialista.apellido}`,
        diasAtencion: especialista.diasAtencion
      }));
  };

  const handleDayPress = (day) => {
    if (diasHabilitados[day.dateString]) {
      const nuevasFechas = { ...diasHabilitados };
      Object.keys(nuevasFechas).forEach(fecha => {
        if (nuevasFechas[fecha].selected) {
          nuevasFechas[fecha] = {
            ...nuevasFechas[fecha],
            selected: false
          };
        }
      });
      nuevasFechas[day.dateString] = {
        ...nuevasFechas[day.dateString],
        selected: true
      };
      setDiasHabilitados(nuevasFechas);
    }
  };

  const manejarSeleccionEspecialidad = (especialidad) => {
    setEspecialidadSeleccionada(especialidad);
    setMostrarDoctores(true);
    setTitulo(especialidad);
  };

  const alternarCalendario = (doctor) => {
    setDoctorSeleccionado(doctor);
    const doctorInfo = especialistas.find(esp => esp.id === doctor.id);
    if (doctorInfo && doctorInfo.diasAtencion) {
      const diasHabilitados = generarDiasHabilitados(doctorInfo.diasAtencion);
      setDiasHabilitados(diasHabilitados);
    }
    setMostrarCalendario(true);
  };

  const atras = () => {
    if (mostrarCalendario) {
      setMostrarCalendario(false);
      setDoctorSeleccionado(null);
    } else if (mostrarDoctores) {
      setMostrarDoctores(false);
      setEspecialidadSeleccionada(null);
      setTitulo('Nuevo Turno');
    }
  };

  const especialidadesFiltradas = especialidadesDisponibles.filter(
    esp => esp.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  );


  
  const confirmarTurno = async () => {
    const fechaSeleccionada = Object.keys(diasHabilitados).find((fecha) => diasHabilitados[fecha].selected)

    const turno = { //lo que tenga que tener el turno
        doctor : doctorSeleccionado.nombre,
        especialidad: especialidadSeleccionada,
        fecha: fechaSeleccionada
    }

        const responseTurno = await fetch('https://674352f3b7464b1c2a646aa5.mockapi.io/api/v1/turnos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turno)
        })

        const turnoCreado = await responseTurno.json()

        const responseUsuario = await fetch(`https://674352f3b7464b1c2a646aa5.mockapi.io/api/v1/usuarios/${user.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                turnos: [...user.turnos, turnoCreado.id]
            })
        })
     
    alert(`Turno confirmado para ${doctorSeleccionado.nombre} el ${fechaSeleccionada}`)

    setMostrarCalendario(false)
    setMostrarDoctores(false)
    setTitulo("Selecciona una especialidad")
    setEspecialidadSeleccionada(null)
    setDoctorSeleccionado(null)
    setDiasHabilitados({})
  }

  
  
    return(
        <View style={styles.contenedor}>
        <View style={styles.cabecera}>
          <Icon name="chevron-back-outline" size={24} color="#000" onPress={atras} />
          <Text style={styles.titulo}>{titulo}</Text>
        </View>
  
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar especialidad"
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
        />
  
        {!mostrarDoctores ? (
          <FlatList
            data={especialidadesFiltradas}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.tarjeta} 
                onPress={() => manejarSeleccionEspecialidad(item.especialidad)}
              >
                <View style={styles.contenidoTarjeta}>
                  <Text style={styles.textoEspecialidad}>{item.especialidad}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.contenedorDoctores}>
            <Text style={styles.tituloEspecialidad}>{especialidadSeleccionada}</Text>
            <FlatList
              data={obtenerDoctoresPorEspecialidad(especialidadSeleccionada)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.tarjetaDoctor}>
                  <Text style={styles.nombreDoctor}>{item.nombre}</Text>
                  <Text style={styles.distanciaDoctor}>{item.distancia}</Text>
                  <View style={styles.contenedorBotones}>
                    <TouchableOpacity 
                      style={styles.boton} 
                      onPress={() => alternarCalendario(item)}
                    >
                      <Text style={styles.textoBoton}>Ver Agenda</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}
  
        {mostrarCalendario && (
          <View style={styles.contenedorCalendario}>
            <Calendar
              current={new Date().toISOString().split('T')[0]}
              minDate={new Date().toISOString().split('T')[0]}
              markedDates={diasHabilitados}
              onDayPress={handleDayPress}
              monthFormat={'MMMM yyyy'}
              onMonthChange={(month) => { console.log('Mes cambiado', month); }}
              disableAllTouchEventsForDisabledDays={true}
              theme={{
                textDisabledColor: '#d9e1e8',
                selectedDayBackgroundColor: '#4CAF50',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4CAF50',
                dayTextColor: '#2d4150',
                textMonthFontWeight: 'bold',
                arrowColor: '#4CAF50',
              }}
            />
            {doctorSeleccionado && (
              <View style={styles.infoDoctor}>
                <Text style={styles.nombreDoctorCalendario}>
                  {doctorSeleccionado.nombre}
                </Text>
                <Text style={styles.diasAtencion}>
                  Días de atención: {doctorSeleccionado.diasAtencion.join(', ')}
                </Text>
              </View>
            )}
            <TouchableOpacity
            style={styles.boton}
            onPress={confirmarTurno}
            >
                <Text style={styles.textoBoton}>Confirmar Turno</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#f0f8ff',
      padding: 10,
    },
    cabecera: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 8,
      elevation: 2,
    },
    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    inputBusqueda: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
    },
    tarjeta: {
      backgroundColor: '#b3e5fc',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      width: '47%',
      aspectRatio: 1,
      elevation: 3,
    },
    contenidoTarjeta: {
      alignItems: 'center',
      padding: 10,
    },
    imagenPlaceholder: {
      width: 80,
      height: 80,
      marginBottom: 5,
      borderRadius: 40,
    },
    textoEspecialidad: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
    },
    contenedorDoctores: {
      marginTop: 10,
    },
    tituloEspecialidad: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#2d4150',
    },
    tarjetaDoctor: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      elevation: 2,
    },
    nombreDoctor: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4150',
    },
    distanciaDoctor: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
    },
    contenedorBotones: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    boton: {
      backgroundColor: '#4CAF50',
      borderRadius: 5,
      padding: 10,
      width: '48%',
      alignItems: 'center',
    },
    textoBoton: {
      color: '#fff',
      fontWeight: '500',
    },
    contenedorCalendario: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
    },
    infoDoctor: {
      padding: 10,
      marginTop: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
    },
    nombreDoctorCalendario: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2d4150',
      marginBottom: 5,
    },
    diasAtencion: {
      fontSize: 14,
      color: '#666',
    },
  });
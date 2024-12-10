import React, { createContext, useState, useEffect } from 'react';

export const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const [turnos, setTurnos] = useState([])
  const [proximos, setProximos] = useState([])
  const [cancelados, setCancelados] = useState([])

  const esTurnoVencido = (fecha) => {
    const ahora = new Date()
    const fechaTurno = new Date(fecha)
    return fechaTurno < ahora // turno vencido si la fecha es anterior a la actual
  }

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch('https://674352f3b7464b1c2a646aa5.mockapi.io/api/v1/turnos')
        const data = await response.json()

        // clasifico por vencido
        const prox = data.filter(turno => !esTurnoVencido(turno.fecha)) // turnos próximos
        const canc = data.filter(turno => esTurnoVencido(turno.fecha)) // turnos cancelados o vencidos

        // ordeno por fecha
        const ordenadosProximos = prox.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        const ordenadosCancelados = canc.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

        setTurnos(data)
        setProximos(ordenadosProximos)
        setCancelados(ordenadosCancelados)
      } catch (error) {
        console.error('Error fetching turnos:', error)
      }
    }

    fetchTurnos();
  }, [])

  const eliminarTurno = (id) => {
    const turnoEliminado = turnos.find(turno => turno.id === id)
    const updatedTurnos = turnos.filter(turno => turno.id !== id)

    if (turnoEliminado) {
      setCancelados(prevCancelados => [...prevCancelados, turnoEliminado])
    }

    setTurnos(updatedTurnos);
    setProximos(updatedTurnos.filter(turno => !esTurnoVencido(turno.fecha)))
  }

  return (
    <TurnosContext.Provider value={{ turnos, proximos, cancelados, eliminarTurno }}>
      {children}
    </TurnosContext.Provider>
  )
}

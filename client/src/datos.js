import React, {use, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

function Datos() {

  const [datos, setDatos] = useState([{}])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

    useEffect(() =>{
      fetch("/api/verTramos").then(
        Response => {
          if(!Response.ok){
            throw new Error('Error, Estado: ${response.status}')
          }
          return Response.json();  
        }).then(datos => {
          setDatos(datos)
          setLoading(false)
        })
        .catch(error =>{
          setError(error)
          setLoading(false)
        })
    }, [])
    if (loading) return <p>Cargando datos...</p>
    if (error) return <p>Error al cargar: {error.message}</p>


  return (
    <div>
      {datos.map(item => (
        <li key={item.id}>
          {item.inicio}-{item.destino}
        </li>
      ))}
      <Link to="/">
        <button>
          Volver a la principal
        </button>
      </Link>
    </div>
  )
}

export default Datos
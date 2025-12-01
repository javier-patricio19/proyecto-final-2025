import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

function Datos() {

  const [backendData, setBackendData] = useState([{}])

    useEffect(() =>{
      fetch("/api").then(
        Response =>Response.json()
      ).then(
        data => {
          setBackendData(data)
        }
      )
    }, [])


  return (
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p>loading...</p> 
      ): (
        backendData.users.map((user, i) =>(
          <p key={i}>{user}</p>
        ))
      )}
      <Link to="/">
        <button>
          Volver a la principal
        </button>
      </Link>
    </div>
  )
}

export default Datos
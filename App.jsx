import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import Stats from './components/Stats'
import api from './api'

function App() {
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/vendors')
      .then(res => {
        console.log("API Response:", res.data);
        setTotal(Array.isArray(res.data) ? res.data.length : 0)
      })
      .catch(err => {
        console.error("API Error:", err);
        setError(err.message);
      })
  }, [])

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#f0f0f0" }}>
      <h1 style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }}>SVMS Dashboard {error && `(Error: ${error})`}</h1>
      <Stats total={total} />
      <MapView />
    </div>
  )
}

export default App

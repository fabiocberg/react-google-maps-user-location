import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [init, setInit] = useState(true)
  const [showPermissionDenied, setShowPermissionDenied] = useState(false)
  const [userPosition, setUserPosition] = useState<GeolocationPosition>()

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function success(position) {
      console.log(position)
      setUserPosition(position)
    })
  }

  const handlePermissionState = (result: PermissionStatus) => {
    setShowPermissionDenied(false)
    if (result.state === "granted") {
      getUserLocation()
    } else if (result.state === "prompt") {
      getUserLocation()
    } else if (result.state === "denied") {
      setShowPermissionDenied(true)
    }
  }

  useEffect(() => {
    if (init) {
      setInit(false)
      if (navigator.geolocation) {
        navigator.permissions
          .query({name: "geolocation"})
          .then(function(result) {
            handlePermissionState(result)
            result.onchange = function() {
              handlePermissionState(result)
            }
          })
      } else {
        console.log("Localização não disponível.")
      }
    }
    
  }, [])

  return (
    <div className='App'>

    </div>
  )
}

export default App

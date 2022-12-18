import { useEffect, useState } from 'react'
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
  
} from "@react-google-maps/api";
import './App.css'

const center = { lat: -27.596433, lng: -48.508353 };
const libraries: any = []

function App() {

  const [init, setInit] = useState(true)
  const [showPermissionDenied, setShowPermissionDenied] = useState(false)
  const [map, setMap] = useState<google.maps.Map>();
  const [userPosition, setUserPosition] = useState<GeolocationPosition>()
  const [friendsPositions, setFriendsPositions] = useState<any>([])
  const getFriends = async(coords: GeolocationCoordinates) => {
    try {
      console.log('coords', coords)
      const resp = await fetch('http://127.0.0.1:3001/api/friends', {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({location: {lat: coords.latitude, lng: coords.longitude}})
      })
      const json = await resp.json()
      setFriendsPositions(json.friends)
      console.log(json)
    } catch (e) {
      console.log(e)
    }
  }

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function success(position) {
      console.log(position)
      setUserPosition(position)
      getFriends(position.coords)
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
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
    >
      <div className="map">
        <GoogleMap
          onLoad={setMap}
          center={center}
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {userPosition && <Marker position={
            {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude}
            } />}
          {friendsPositions.map((friendPosition: any, index: number) => (<Marker key={`marker_friend_${index}`} position={
            {lat: friendPosition.position.lat, lng: friendPosition.position.lng}
            } title={friendPosition.name} />))}
        </GoogleMap>
      </div>
    </LoadScript>
  )
}

export default App

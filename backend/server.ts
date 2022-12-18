import express from "express"
import cors from "cors"

const friends = [
    {name: "A", position: {lat: -27.596718, lng: -48.500222}},
    {name: "B", position: {lat: -27.599951, lng: -48.506936}},
    {name: "C", position: {lat: -27.573206, lng: -48.529778}},
]

function getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
    // console.log(lat1, lon1, lat2 ,lon2)
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg: any) {
    return deg * (Math.PI/180)
}

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/friends', (req, res) => {
    const {location} = req.body
    // console.log('req.body: ', req.body)
    const filteredFriends = friends.filter((friend) => {
        const distance = getDistanceFromLatLonInKm(
            location.lat, 
            location.lng, 
            friend.position.lat,
            friend.position.lng
        )
        console.log(distance)
        return distance <= 2.0
    })
    res.json({friends: filteredFriends})
})

const port = process.env.port || 3001

app.listen(port, () => {
     console.log(`Server is running at ${port}`)
})
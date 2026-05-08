import dotenv from 'dotenv' // en produccion osea en render no se cargan las variables de entorno, lo comento para subirlo al ghub de despliegue
import cors from 'cors'
import express from 'express'
import GoogleMapsRoutes from './src/routes/GoogleMapsRoutes.js'
import GasolinerasRoutes from './src/routes/GasolinerasRoutes.js'
import {connectToDatabase} from './src/services/mongoServices.js'
import { cargarDatosApi } from './src/services/actualizacionDiaria.js'
import cron from 'node-cron';
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
 dotenv.config() 
}


const db = await connectToDatabase()
try {    
  await cargarDatosApi(db)
}catch (error) {
    console.error('Error al cargar los datos iniciales:', error);
}

cron.schedule('0 0 * * *', () => { // Cada día a medianoche se cargan los datos
  try {
    cargarDatosApi(db)
  } catch (error) {
    console.error('Error al cargar los datos diarios:', error);
  }
})




app.use(cors())
app.use(express.json())
app.use(GoogleMapsRoutes)
app.use(GasolinerasRoutes)
app.get('/', (req, res) => {
  res.send('Node server is running!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  
})

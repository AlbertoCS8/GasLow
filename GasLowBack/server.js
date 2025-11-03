import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import GoogleMapsRoutes from './src/routes/GoogleMapsRoutes.js'
import GasolinerasRoutes from './src/routes/GasolinerasRoutes.js'
import {connectToDatabase} from './src/services/mongoServices.js'
import { cargarDatosApi } from './src/services/actualizacionDiaria.js'
import cron from 'node-cron';
const app = express()
const port = 3000
dotenv.config()

const db = await connectToDatabase()

cron.schedule('0 0 * * *', () => { // Cada día a medianoche se cargan los datos
    cargarDatosApi(db)
})
cargarDatosApi(db)



app.use(cors())
app.use(express.json())
app.use(GoogleMapsRoutes)
app.use(GasolinerasRoutes)
app.get('/', (req, res) => {
  res.send('Node server is running!')
})

app.listen(port, () => {
  
})

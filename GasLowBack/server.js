import dotenv from 'dotenv' // en produccion osea en render no se cargan las variables de entorno, lo comento para subirlo al ghub de despliegue
import cors from 'cors'
import express from 'express'
import GoogleMapsRoutes from './src/routes/GoogleMapsRoutes.js'
import GasolinerasRoutes from './src/routes/GasolinerasRoutes.js'
import { connectToDatabase } from './src/services/mongoServices.js'
import { cargarDatosApi } from './src/services/actualizacionDiaria.js'
import cron from 'node-cron';
process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
async function startServer() {
  try {
    const db = await connectToDatabase()

    app.use(cors())
    console.log('CORS habilitado')

    app.use(express.json())
    console.log('JSON middleware habilitado')

    app.use(GoogleMapsRoutes)
    console.log('Google routes cargadas')

    app.use(GasolinerasRoutes)
    console.log('Gasolineras routes cargadas')

    app.get('/', (req, res) => {
      res.send('Node server is running!')
    })

    app.listen(port, () => {
      console.log(`Server running on ${port}`)
    })
    try {
      console.log('Cargando datos iniciales...')
      await cargarDatosApi(db)
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
    }

    cron.schedule('0 0 * * *', async () => { // Cada día a medianoche se cargan los datos
      try {
        console.log('Ejecutando tarea programada para cargar datos diarios...')
        await cargarDatosApi(db)
      } catch (error) {
        console.error('Error al cargar los datos diarios:', error);
      }
    })

  } catch (error) {
    console.error('Error iniciando servidor:', error)
  }
}

startServer()
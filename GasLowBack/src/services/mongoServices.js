import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}


const mongoURI = process.env.MONGODB_URI
const dbName = 'GasLow'

let dbConnection

export const connectToDatabase = async () => {
  if (dbConnection) return dbConnection

  try {
    const client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    dbConnection = client.db(dbName)
    console.log('Connected to MongoDB')
    return dbConnection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

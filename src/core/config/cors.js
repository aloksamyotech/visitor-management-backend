import cors from 'cors'

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:7200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
}

const corsConfig = cors()
export default corsConfig

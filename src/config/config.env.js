import { config } from 'dotenv';

config({
  path: '../.env'
})

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL
}
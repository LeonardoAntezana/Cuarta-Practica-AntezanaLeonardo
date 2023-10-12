import { config } from 'dotenv';
import { testMode } from './config.command.js';

// ADD VARIABLES
config({
  path: '../.env'
})

export default {
  PORT: process.env.PORT,
  MONGO_URL: testMode ? process.env.MONGO_URL_TEST : process.env.MONGO_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL
}

export const GOOGLE_AUTHS = {
  USER_EMAIL: process.env.GOOGLE_USER_EMAIL,
  USER_PASSWORD: process.env.GOOGLE_USER_PASSWORD
}
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
   APP_NAME: 'Terranium',
   APP_PORT: process.env.APP_PORT,
   ACCESS_TOKEN_SECRET: 'nani-nano',
   REFRESH_TOKEN_SECRET: 'nano-nano'
}

export default config;
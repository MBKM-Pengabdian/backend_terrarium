import * as dotenv from 'dotenv';
dotenv.config();

const config = {
   APP_NAME: 'Terranium',
   APP_PORT: process.env.APP_PORT || 3000,

   ACCESS_TOKEN_SECRET_ADMIN: 'ini-admin-wkwk',
   REFRESH_TOKEN_SECRET_ADMIN: 'ini-admin-wkwk',

   ACCESS_TOKEN_SECRET_SUPER_ADMIN: 'ini-superadmin-wkwk',
   REFRESH_TOKEN_SECRET_SUPER_ADMIN: 'ini-superadmin-wkwk'
}

export default config;
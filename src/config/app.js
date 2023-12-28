import * as dotenv from 'dotenv';
dotenv.config();

const config = {
   APP_NAME: 'Terranium',
   APP_PORT: process.env.APP_PORT || 3000,

   ACCESS_TOKEN_SECRET_ADMIN: 'ini-access-admin-wkwk',
   REFRESH_TOKEN_SECRET_ADMIN: 'ini-refresh-admin-wkwk',

   ACCESS_TOKEN_SECRET_SUPER_ADMIN: 'ini-access-superadmin-wkwk',
   REFRESH_TOKEN_SECRET_SUPER_ADMIN: 'ini-refresh-superadmin-wkwk',

   ACCESS_TOKEN_SECRET_CUSTOMER: 'ini-access-customer-wkwk',
   REFRESH_TOKEN_SECRET_CUSTOMER: 'ini-refresh-customer-wkwk',

   IMG_LIMIT_SIZE: (1 * 1024 * 1024),
   IMG_UPLOAD_DIR: 'public/images',
}

export default config;
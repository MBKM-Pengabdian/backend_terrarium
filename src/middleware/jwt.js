// Import necessary modules and configurations
import config from "../config/app.js";
import pkg from 'jsonwebtoken';

const { verify, TokenExpiredError } = pkg;

// Function to handle token verification and validation
const handleTokenVerification = (token, secret) => {
   try {
      return verify(token, secret);
   } catch (error) {
      if (error instanceof TokenExpiredError) {
         throw new TokenExpiredError();
      }
      throw new Error();
   }
};

// Middleware for checking admin role in the token
export const checkJWTAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (!bearerHeader) {
         throw new Error();
      }

      const token = bearerHeader.split(' ')[1];

      let payload;
      try {
         payload = handleTokenVerification(token, config.ACCESS_TOKEN_SECRET_ADMIN);
         res.locals.role = 'admin';
      } catch (error) {
         payload = handleTokenVerification(token, config.ACCESS_TOKEN_SECRET_SUPER_ADMIN);
         res.locals.role = 'superadmin';
      }

      if (!payload.userId) {
         throw new Error('Missing user_id in token payload');
      }

      res.locals.payload = payload;

      next();
   } catch (error) {
      console.log('admin:', error);
      return res.status(401).send({
         message: 'Unauthorized',
      });
   }
};

export const checkJWTSuperAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (!bearerHeader) {
         throw new Error();
      }

      const token = bearerHeader.split(' ')[1];

      res.locals.payload = handleTokenVerification(token, config.ACCESS_TOKEN_SECRET_SUPER_ADMIN);

      next();
   } catch (error) {
      console.log('super admin :', error);
      return res.status(401).send({
         message: 'Unauthorized',
      });
   }
};
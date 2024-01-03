import config from "../config/app.js";
import pkg from 'jsonwebtoken';

const { verify, TokenExpiredError } = pkg;

export const checkJWTSuperAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader === undefined) {
         throw Error();
      }

      const token = bearerHeader.split(' ')[1];

      let payload = {};

      try {
         try {
            payload = verify(token, config.ACCESS_TOKEN_SECRET_SUPER_ADMIN);
         } catch (error) {
            if (error instanceof TokenExpiredError) {
               return res.status(401).send({
                  status: 401,
                  message: 'EXPIRED_TOKEN',
               });
            }
            payload = verify(token, config.ACCESS_TOKEN_SECRET_ADMIN);
         }
      } catch (error) {
         if (error instanceof TokenExpiredError) {
            return res.status(401).send({
               status: 401,
               message: 'EXPIRED_TOKEN',
            });
         }
         return res.status(401).send({
            status: 401,
            message: 'INVALID_TOKEN',
         });
      }

      res.locals.payload = payload;
      next();
   } catch (error) {
      console.error(error);
      return res.status(401).send({
         status: 401,
         message: 'Unauthorized',
      });
   }
}

export const checkJWTAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader === undefined) {
         throw Error();
      }

      const token = bearerHeader.split(' ')[1];

      verify(token, config.ACCESS_TOKEN_SECRET_ADMIN, function (err, decoded) {
         if (err !== null) {
            if (err.name === 'TokenExpiredError') {
               return res.status(401).send({
                  message: 'EXPIRED_TOKEN',
               });
            }
         }
         res.locals.payload = decoded;
         next();
      });
   } catch (error) {
      console.error(error);
      return res.status(401).send({
         status: 401,
         message: 'Unauthorized',
      });
   }
}

export const checkJWTCustomer = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader === undefined) {
         throw Error();
      }

      const token = bearerHeader.split(' ')[1];

      const verifyToken = (token, secret) => {
         try {
            return verify(token, secret);
         } catch (error) {
            if (error instanceof TokenExpiredError) {
               throw {
                  status: 401,
                  message: 'EXPIRED_TOKEN',
               };
            }
            throw {
               status: 401,
               message: 'INVALID_TOKEN',
            };
         }
      };

      const payload = verifyToken(token, config.ACCESS_TOKEN_SECRET_CUSTOMER);

      res.locals.payload = payload;
      next();
   } catch (error) {
      console.error(error);
      return res.status(error.status || 401).send({
         status: error.status || 401,
         message: error.message || 'Unauthorized',
      });
   }
}
import config from "../config/app.js";
import pkg from 'jsonwebtoken';

const { verify, TokenExpiredError } = pkg;

export const checkJWTAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader === undefined) {
         throw Error();
      }

      const token = bearerHeader.split(' ')[1];

      let payload = {};
      try {
         payload = verify(token, config.ACCESS_TOKEN_SECRET_ADMIN);
         res.locals.role = 'admin';
      } catch (adminError) {
         try {
            payload = verify(token, config.ACCESS_TOKEN_SECRET_SUPER_ADMIN);
            res.locals.role = 'superadmin';
         } catch (superadminError) {
            if (adminError instanceof TokenExpiredError || superadminError instanceof TokenExpiredError) {
               return res.status(401).send({
                  message: 'EXPIRED_TOKEN',
               });
            }
            throw Error();
         }
      }

      res.locals.payload = payload;
      next();
   } catch (error) {
      console.log(error);
      return res.status(401).send({
         message: 'INVALID_TOKEN',
      });
   }
};


export const checkJWTSuperAdmin = async (req, res, next) => {
   try {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader === undefined) {
         throw Error();
      }

      const token = bearerHeader.split(' ')[1];

      verify(token, config.ACCESS_TOKEN_SECRET_SUPER_ADMIN, function (err, decoded) {
         if (err !== null) {
            if (err.name === 'TokenExpiredError') {
               return res.status(401).send({
                  message: 'EXPIRED_TOKEN',
               });
            }
            if (err.name === 'JsonWebTokenError') {
               throw Error();
            }
         }

         res.locals.payload = decoded;
         next();
      });
   } catch (error) {
      return res.status(401).send({
         message: 'INVALID_TOKEN',
      });
   }
};

# API Documentation

## Register User

- **URL:** `/api/auth/register`
- **Method:** `PUT`
- **Request:**

   ```json
   {
      "username": "johndoe",
      "password": "john123",
      "email": "john@gmail.com",
      "role": "customer"
   }

- **Response:**
   ```json
      {
         "message": "SUCCESS"
      }
   ```

## Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request:**

   ```json
   {
      "username": "johndoe",
      "password": "john123",
   }
   ```

- **Response:**
   ```json
      {
         "message": "SUCCESS",
         "data": {
            "userId": 1,
            "username": "customer",
            "email": "customer@gmail.com",
            "role": "customer",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDA4MTM5OX0.cKzz5tg91aHlwsKPvt_EeHuSm3G2pEPl0GHeuUgRbq8",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDA4MTM5OX0._lPiWVp-LV9pZMKrIy9jOBr8pFdA4aCHLFvWQRKRc70"
         }
      }
   ```

## Logout

- **URL:** `/api/auth/logout`
- **Method:** `DELETE`
- **Request:**

   ```json
      {
         "refreshToken": "token"
      }
   ```

- **Response:**
   ```json
      {
         "message": "SUCCESS"
      }
   ```


## Refresh Token

- **URL:** `/api/auth/refresh`
- **Method:** `DELETE`
- **Request:**

   ```json
      {
         "refreshToken": "token"
      }
   ```

- **Response:**
   ```json
      {
         "message": "SUCCESS",
         "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDA4MjcxMywiZXhwIjoxNzAwMDgzMzEzfQ.EDHZWmw4qf1NMN8jKMD6f3DTddjKvT43qXjmQ_mXLNE",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDA4MjcxM30.mWhVSo3y_8ujZGYS9PSJdLcAo0aTdFmGpOkvb2zK_Bk"
         }
      }
   ```
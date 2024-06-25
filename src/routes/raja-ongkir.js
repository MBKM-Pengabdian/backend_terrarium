import express from 'express';
import { getCityRO, getCostRO, getProvinsiRO } from '../controllers/check_ongkir/read.js';

const RajaOngkir = express.Router();

RajaOngkir.get('/region/provinsi/', getProvinsiRO);
RajaOngkir.get('/region/city/', getCityRO);
RajaOngkir.post('/cost/', getCostRO);

export default RajaOngkir;

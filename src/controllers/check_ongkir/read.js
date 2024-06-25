import axios from "axios";
import qs from "qs";

export const getProvinsiRO = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: process.env.RAJA_ONGKIR_KEY,
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCityRO = async (req, res) => {
  const { id } = req.query;
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        headers: {
          key: process.env.RAJA_ONGKIR_KEY,
        },
        params: {
          province: id, // Menambahkan parameter provinsi ID ke permintaan
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCostRO = async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  try {
    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      qs.stringify({
        origin,
        destination,
        weight,
        courier,
      }),
      {
        headers: {
          key: process.env.RAJA_ONGKIR_KEY,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

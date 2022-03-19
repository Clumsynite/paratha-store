import axios from 'axios';

export const URL = `${process.env.REACT_APP_API_URL}`;

export const getAllDishes = async () => {
  const response = await axios.get(`${URL}/dishes`);
  return response.data;
};

export const getAllAddons = async () => {
  const response = await axios.get(`${URL}/addons`);
  return response.data;
};

export const getAllDeliveryRates = async () => {
  const response = await axios.get(`${URL}/delivery-rates`);
  return response.data;
};

import {
  arrayOf, number, shape, string,
} from 'prop-types';

export const Dish = shape({
  id: string,
  name: string,
  price: number,
  addons: arrayOf(string),
});

export const Addon = shape({
  id: string,
  name: string,
  price: number,
});

export const DeliveryRate = shape({
  if: string,
  price: number,
  label: string,
  range: shape({
    min: number,
    max: number,
  }),
});

export const CartProduct = shape({
  cartID: string.isRequired,
  dishID: string.isRequired,
  quantity: number.isRequired,
  addons: arrayOf(string),
});

export const DishInCart = shape({
  id: string,
  quantity: number,
  name: string,
  price: number,
  addons: arrayOf(Addon),
  product: CartProduct,
});

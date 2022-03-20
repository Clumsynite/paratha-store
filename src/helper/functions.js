export const getProductCost = (
  product = { price: 0, addons: [], quantity: 1 },
) => {
  let total = product.price;
  product.addons.forEach((addon) => {
    total += addon.price;
  });
  return total * product.quantity;
};

export const getTotalCost = (products = []) => {
  let total = 0;
  products.forEach((product) => {
    total += getProductCost(product);
  });
  return total;
};

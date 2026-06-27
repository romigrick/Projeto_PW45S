/**

 * @param total - The subtotal of the order.
 * @returns The shipping cost.
 */
export const calculateShipping = (total: number, shippingType: 'NORMAL' | 'EXPRESSO'): number => {
  if (shippingType === 'EXPRESSO') {
    return 59.90;
  }

  // NORMAL shipping
  if (total >= 1000) {
    return 0;
  }
  return 29.00;
};

/**

 * @param total - The subtotal of the order.
 * @returns The shipping cost.
 */
export const calculateShipping = (total: number): number => {
  if (total > 1000) {
    return 0;  
  }
  return 29.90;  
};

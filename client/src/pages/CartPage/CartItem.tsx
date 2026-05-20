import React from 'react';
import { useCart } from '../../context/CartContext';
import type { ICartItem } from '../../commons/types';

interface CartItemProps {
  item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.product.id!, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.id!);
  };

  return (
    <div className="cart-item">
      <img
        src={item.product.urlImagem || 'https://placehold.co/80x80/eee/333?text=Produto'}
        alt={item.product.name}
        className="cart-item-image"
      />

      <div className="cart-item-content">
        <h3 className="cart-item-title">{item.product.name}</h3>
        <div className="cart-item-price">{formatPrice(item.product.price)}</div>

        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="quantity-input"
            />
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            className="remove-button"
            onClick={handleRemove}
          >
            Remover
          </button>
        </div>

        <div className="cart-item-subtotal">
          Subtotal: {formatPrice(item.product.price * item.quantity)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;

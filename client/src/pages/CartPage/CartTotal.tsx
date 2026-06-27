import React from 'react';
import { calculateShipping } from '../../lib/shipping';

interface CartTotalProps {
  total: number;
  onFinalizeOrder: () => void;
  itemCount: number;
}

const CartTotal: React.FC<CartTotalProps> = ({ total, onFinalizeOrder, itemCount }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const shipping = calculateShipping(total);
  const finalTotal = total + shipping;

  return (
    <div className="cart-total-container">
      <h3 className="cart-total-title">Resumo do Pedido</h3>

      <div className="summary">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">{formatPrice(total)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Frete</span>
          <span className="summary-value">
            {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
          </span>
        </div>

        <div className="total-row">
          <span className="total-label">Total</span>
          <span className="total-value">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {total > 1000 && (
        <div className="free-shipping">
          🎉 Parabéns! Você ganhou frete grátis!
        </div>
      )}

      <button
        className="finalize-button"
        onClick={onFinalizeOrder}
        disabled={itemCount === 0}
      >
        Finalizar Pedido
      </button>
    </div>
  );
};

export default CartTotal;

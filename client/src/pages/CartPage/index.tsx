import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartTotal from './CartTotal';
import './styles.css';

const CartPage = () => {
  const { items, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFinalizeOrder = () => {
    navigate('/checkout');
  };

  const cartContentClass = isMobile ? 'cart-content-mobile' : 'cart-content-desktop';

  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="breadcrumb">
          Você está em: <a href="/" className="breadcrumb-link">Home</a> / Carrinho
        </div>

        <h1 className="cart-title">Carrinho de Compras</h1>

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2 className="empty-cart-title">Seu carrinho está vazio</h2>
            <p className="empty-cart-text">
              Adicione produtos ao seu carrinho para continuar comprando.
            </p>
            <button
              className="empty-cart-button"
              onClick={() => navigate('/products')}
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className={cartContentClass}>
            <div className="cart-items">
              <h2 className="cart-items-title">
                Itens no Carrinho ({items.length})
              </h2>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            <CartTotal
              total={getTotalPrice()}
              onFinalizeOrder={handleFinalizeOrder}
              itemCount={items.length}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
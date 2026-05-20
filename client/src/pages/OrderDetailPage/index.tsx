import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { IOrder, IOrderItem } from '../../commons/types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { Button } from 'primereact/button';
import './styles.css';

import { calculateShipping } from '../../lib/shipping';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (!id) {
      setError('ID do pedido não fornecido.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await OrderService.getOrderById(Number(id));
        if (response.success && response.data) {
          setOrder(response.data as IOrder);
        } else {
          setError(response.message || 'Erro ao buscar detalhes do pedido.');
        }
      } catch (err) {
        setError('Ocorreu um erro ao buscar os detalhes do seu pedido.');
        console.error('Erro ao buscar detalhes do pedido:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Desconhecido';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'delivered':
        return 'Entregue';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      default:
        return status;
    }
  };

  const handleBuyAgain = () => {
    if (order?.items) {
      order.items.forEach(item => {
        addToCart(item.product, item.quantity);
      });
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-column min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
            <p>Carregando detalhes do pedido...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-column min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
            <p className="text-red-500">{error || 'Pedido não encontrado.'}</p>
            <Button
              label="Voltar para Meus Pedidos"
              icon="pi pi-arrow-left"
              onClick={() => navigate('/orders')}
              className="mt-3 p-button-secondary"
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;


  return (
    <div className="order-detail-page">
      <Header />
      <main className="order-detail-container">
        <div className="order-summary-header">
          <Button
            icon="pi pi-arrow-left"
            label="Meus Pedidos"
            className="p-button-text p-button-secondary back-button"
            onClick={() => navigate('/orders')}
          />
          <h1 className="order-title">Detalhes do Pedido</h1>
          <div className="order-meta">
            <span>Pedido #{order.id}</span>
            <span className="separator">|</span>
            <span>Feito em {formatDate(order.orderDate)}</span>
            <span className="separator">|</span>
            <span className={`status status-${order.status}`}>{getStatusLabel(order.status)}</span>
          </div>
        </div>
        
        <div className="order-content-grid">
          <div className="order-items-section">
            <div className="section-header">
              <h2 className="section-title">Itens do Pedido ({totalItems})</h2>
              <Button 
                label="Comprar novamente" 
                icon="pi pi-replay"
                className="buy-again-button"
                onClick={handleBuyAgain}
              />
            </div>

            {order.items?.map((item: IOrderItem) => (
              <Link to={`/product/${(item.product as any).id}`} key={item.id} className="order-item-card-link">
                <div className="order-item-card">
                  <img 
                    src={(item.product as any)?.urlImagem || 'https://placehold.co/100x100/eee/333?text=Img'} 
                    alt={(item.product as any)?.name || 'Imagem do produto'}
                    className="item-image"
                  />
                  <div className="item-details">
                    <p className="item-name">{(item.product as any)?.name || 'Produto indisponível'}</p>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                    <p className="item-quantity">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="order-details-section">
            <div className="details-card">
              <div>
                <h3 className="card-title">Endereço de Entrega</h3>
                <div className="card-content">
                  <p>{order.address?.street}, {order.address?.number} - {order.address?.neighborhood}, {order.address?.city} - {order.address?.state}</p>
                  <p>CEP: {order.address?.zipCode}</p>
                </div>
              </div>
              <div className="card-separator"></div>
              <div>
                <h3 className="card-title">Resumo Financeiro</h3>
                <div className="card-content">
                  <div className="financial-row">
                    <span>Subtotal ({totalItems} {totalItems > 1 ? 'itens' : 'item'}):</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="financial-row">
                    <span>Frete:</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="financial-row total-row">
                    <span>Total do Pedido:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { IOrder, IProduct } from '../../commons/types';
import { useCart } from '../../context/CartContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import './styles.css';

const OrdersPage = () => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getUserOrders();
        if (response.success && response.data) {
          setOrders(response.data as IOrder[]);
        } else {
          setError(response.message || 'Erro ao buscar pedidos.');
        }
      } catch (err) {
        setError('Ocorreu um erro ao buscar seus pedidos.');
        console.error('Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const categories = useMemo(() => {
    const allCategories = orders.flatMap(order => 
      order.items?.map(item => (item.product as IProduct)?.category?.name)
    ).filter((name): name is string => !!name);
    return [...new Set(allCategories)].map(name => ({ label: name, value: name }));
  }, [orders]);
  
  const filteredOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
      const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
      return dateB - dateA; 
    });

    return sorted.filter(order => {
      const searchTermLower = searchTerm.toLowerCase();
      
      const searchTermMatch = searchTermLower === '' ||
        order.id?.toString().includes(searchTerm) ||
        order.items?.some(item =>
          (item.product as IProduct)?.name.toLowerCase().includes(searchTermLower) ||
          (item.product as IProduct)?.description.toLowerCase().includes(searchTermLower)
        );
  
      const categoryMatch = !selectedCategory ||
        order.items?.some(item => (item.product as IProduct)?.category?.name === selectedCategory);
  
      const dateMatch = !selectedDate || 
        (order.orderDate && new Date(order.orderDate).toDateString() === selectedDate.toDateString());
  
      return searchTermMatch && categoryMatch && dateMatch;
    });
  }, [orders, searchTerm, selectedCategory, selectedDate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-column min-h-screen">
        <Header />
        <div className="loading-error-container">
          <div className="text-center">
            <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
            <p>Carregando pedidos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-column min-h-screen">
        <Header />
        <div className="loading-error-container">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
            <p className="text-red-500">{error}</p>
            <Button
              label="Tentar novamente"
              icon="pi pi-refresh"
              onClick={() => window.location.reload()}
              className="mt-3"
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Header />
      <header className="filters-header">
        <div className="filters-container">
          <div className="filters-content">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-search"></i>
              </span>
              <InputText 
                placeholder="Busque por produto, descrição e mais..." 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-actions">
              <Dropdown 
                value={selectedCategory}
                options={categories}
                onChange={(e) => setSelectedCategory(e.value)}
                placeholder="Categoria"
                showClear
                className="filter-dropdown"
                panelClassName="filter-panel"
              />
              <Calendar 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value as Date | null)}
                placeholder="Data"
                showIcon
                dateFormat="dd/mm/yy"
                className="filter-calendar"
                showClear
              />
              <span className="orders-count-desktop">
                | &nbsp; {filteredOrders.length} compras
              </span>
            </div>
            <span className="orders-count-mobile">
              {filteredOrders.length} compras
            </span>
          </div>
        </div>
      </header>

      <main className="orders-main-content">
        <div className="orders-list-container">
          <h1 className="orders-title">Compras</h1>
          {filteredOrders.length === 0 ? (
          <div className="no-orders-container">
            <i className="pi pi-shopping-bag no-orders-icon"></i>
            <h3 className="no-orders-title">Nenhuma compra encontrada</h3>
            <p className="no-orders-text">
              {orders.length > 0 ? 'Nenhum pedido corresponde aos filtros aplicados.' : 'Você ainda não fez nenhuma compra.'}
            </p>
            <Button
              label={orders.length > 0 ? 'Limpar Filtros' : 'Continuar comprando'}
              icon={orders.length > 0 ? 'pi pi-filter-slash' : 'pi pi-arrow-left'}
              onClick={() => {
                if (orders.length > 0) {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setSelectedDate(null);
                } else {
                  navigate('/products');
                }
              }}
              className="p-button-secondary"
            />
          </div>
          ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-content">
                  <div className="order-card-image-container">
                    <img
                      src={(order.items?.[0]?.product as IProduct)?.urlImagem || 'https://placehold.co/80x80/eee/333?text=Produto'}
                      alt={(order.items?.[0]?.product as IProduct)?.name || 'Imagem do Produto'}
                      className="order-card-image"
                    />
                  </div>
                  <div className="order-card-details">
                    <h3 className="order-product-name">
                      {(order.items?.[0]?.product as IProduct)?.name || 'Produto sem nome'}
                    </h3>
                    <p className="order-product-description">
                      {(order.items?.[0]?.product as IProduct)?.description || 'Sem descrição'}
                      {order.items!.length > 1 && ` e mais ${order.items!.length - 1} item(s)`}
                    </p>
                    <div className="order-meta">
                      <span>Valor total: R$ {(order.total || 0).toFixed(2).replace('.', ',')}</span>
                      <span className="separator">|</span> 
                      <span>{formatDate(order.orderDate!)}</span>
                      <span className="separator">|</span>
                      <span className={`${getStatusColor(order.status!)} font-semibold`}>{getStatusLabel(order.status!)}</span>
                    </div>
                  </div>
                  <div className="order-card-actions">
                    <Button 
                      label="Ver compra" 
                      className="p-button-sm" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                    />
                    <Button
                      label="Comprar novamente"
                      className="p-button-sm btn-buy-again"
                      onClick={() => {
                        const firstItem = order.items?.[0];
                        if (firstItem) addToCart(firstItem.product, firstItem.quantity);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;

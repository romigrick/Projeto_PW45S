import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { IOrder, IOrderItem, IAttachment, IOrderStatusHistory } from '../../commons/types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import './styles.css';
import { calculateShipping } from '../../lib/shipping';

const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em Preparação',
  EM_TRANSPORTE: 'Em Transporte',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#f59e0b',
  PAGO: '#22c55e',
  EM_PREPARACAO: '#8b5cf6',
  EM_TRANSPORTE: '#3b82f6',
  CONCLUIDO: '#10b981',
  CANCELADO: '#ef4444',
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [attachments, setAttachments] = useState<IAttachment[]>([]);
  const [history, setHistory] = useState<IOrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) { setError('ID do pedido não fornecido.'); setLoading(false); return; }
    const fetchOrder = async () => {
      try {
        const [orderRes, attachRes, historyRes] = await Promise.all([
          OrderService.getOrderById(Number(id)),
          OrderService.getAttachments(Number(id)),
          OrderService.getOrderHistory(Number(id)),
        ]);
        if (orderRes.success && orderRes.data) {
          setOrder(orderRes.data as IOrder);
        } else {
          setError(orderRes.message || 'Erro ao buscar detalhes do pedido.');
        }
        if (attachRes.success) setAttachments(attachRes.data || []);
        if (historyRes.success) setHistory(historyRes.data || []);
      } catch (err) {
        setError('Ocorreu um erro ao buscar os detalhes do seu pedido.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Desconhecido';
    return STATUS_LABELS[status] || status;
  };

  const handleBuyAgain = () => {
    if (order?.items) {
      order.items.forEach(item => { addToCart(item.product, item.quantity); });
      navigate('/cart');
    }
  };

  const handleDownload = (attachment: IAttachment) => {
    if (!attachment.id || !id) return;
    OrderService.downloadAttachment(Number(id), attachment.id, attachment.originalFileName);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const timelineEvents = [...history].reverse().map((h) => ({
    label: `${STATUS_LABELS[h.previousStatus || ''] || h.previousStatus || 'Início'} → ${STATUS_LABELS[h.newStatus] || h.newStatus}`,
    date: formatDateTime(h.changedAt),
    obs: h.observation,
    color: STATUS_COLORS[h.newStatus] || '#3b82f6',
  }));

  if (loading) {
    return (
      <div className="flex flex-column min-h-screen">
        <Header />
        <div className="loading-error-container">
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
        <div className="loading-error-container">
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
            <p className="text-red-500">{error || 'Pedido não encontrado.'}</p>
            <Button label="Voltar para Meus Pedidos" icon="pi pi-arrow-left" onClick={() => navigate('/orders')} className="mt-3 p-button-secondary" />
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
          <Button icon="pi pi-arrow-left" label="Meus Pedidos" className="p-button-text p-button-secondary back-button" onClick={() => navigate('/orders')} />
          <h1 className="order-title">Detalhes do Pedido</h1>
          <div className="order-meta">
            <span>Pedido #{order.id}</span>
            <span className="separator">|</span>
            <span>Feito em {formatDate((order as any).orderDate || (order as any).createdAt)}</span>
            <span className="separator">|</span>
            <span className={`status status-${order.status}`}>{getStatusLabel(order.status)}</span>
          </div>
        </div>

        <div className="order-content-grid">
          <div className="order-items-section">
            <div className="section-header">
              <h2 className="section-title">Itens do Pedido ({totalItems})</h2>
              <Button label="Comprar novamente" icon="pi pi-replay" className="buy-again-button" onClick={handleBuyAgain} />
            </div>

            {order.items?.map((item: IOrderItem) => (
              <Link to={`/product/${(item.product as any).id}`} key={(item as any).id} className="order-item-card-link">
                <div className="order-item-card">
                  <img src={(item.product as any)?.urlImagem || 'https://placehold.co/100x100/eee/333?text=Img'} alt={(item.product as any)?.name || 'Imagem do produto'} className="item-image" />
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

            {attachments.length > 0 && (
              <div className="details-card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title">Documentos do Pedido</h3>
                <div className="card-content">
                  {attachments.map((att) => (
                    <div key={att.id} className="flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex align-items-center gap-2">
                        <i className={`pi ${att.contentType?.includes('pdf') ? 'pi-file-pdf text-red-500' : 'pi-image text-blue-500'}`} style={{ fontSize: '1.2rem' }} />
                        <div>
                          <p className="m-0 text-sm font-medium text-900">{att.originalFileName}</p>
                          {att.description && <p className="m-0 text-xs text-500">{att.description}</p>}
                          <p className="m-0 text-xs text-400">{formatSize(att.fileSize)} · {new Date(att.uploadedAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <Button
                        icon="pi pi-download"
                        className="p-button-rounded p-button-text p-button-sm"
                        tooltip="Baixar"
                        onClick={() => handleDownload(att)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="order-details-section">
            <div className="details-card">
              <div>
                <h3 className="card-title">Endereço de Entrega</h3>
                <div className="card-content">
                  <p>{(order as any).address?.street}, {(order as any).address?.number} - {(order as any).address?.neighborhood}, {(order as any).address?.city} - {(order as any).address?.state}</p>
                  <p>CEP: {(order as any).address?.zipCode}</p>
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

            {timelineEvents.length > 0 && (
              <div className="details-card">
                <h3 className="card-title">Histórico do Pedido</h3>
                <Timeline
                  value={timelineEvents}
                  align="left"
                  className="w-full"
                  marker={(item) => (
                    <span
                      className="flex w-2rem h-2rem align-items-center justify-content-center border-circle flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      <i className="pi pi-check text-white text-xs" />
                    </span>
                  )}
                  content={(item) => (
                    <div className="ml-2 mb-3">
                      <p className="font-semibold text-900 m-0 text-sm">{item.label}</p>
                      <small className="text-500 block">{item.date}</small>
                      {item.obs && <small className="text-600 block mt-1 font-italic">"{item.obs}"</small>}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import AddressService from '../../services/addressService';
import type { IAddress, IOrder } from '../../commons/types';
import OrderService from '../../services/orderService';
import { calculateShipping } from '../../lib/shipping';
import { useNotification } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import './styles.css';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [shippingOption, setShippingOption] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('CREDIT_CARD');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isOrderSuccessNavigating, setIsOrderSuccessNavigating] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<IOrder | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await AddressService.getUserAddresses();
        if (response.success && response.data) {
          setAddresses(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses', error);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (items.length === 0 && !isOrderSuccessNavigating) {
      navigate('/cart');
    }
  }, [items, navigate, isOrderSuccessNavigating]);

  const subtotal = getTotalPrice();

  let shippingCost: number;
  if (subtotal > 1000) {
    shippingCost = shippingOption === 'standard' ? 0 : 45.0;
  } else {
    const baseStandard = calculateShipping(subtotal);
    shippingCost = shippingOption === 'standard' ? baseStandard : baseStandard + 30.0;
  }

  const total = subtotal + shippingCost;
  const displayStandardCost = subtotal > 1000 ? 0 : calculateShipping(subtotal);
  const displayExpressCost = subtotal > 1000 ? 45.0 : calculateShipping(subtotal) + 30.0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      addNotification('Selecione um endereço para continuar.', 'error');
      return;
    }

    const orderData = {
      address: { id: selectedAddress.id },
      shippingOption,
      paymentMethod, // já vem em uppercase: CREDIT_CARD, PIX, BOLETO_BANCARIO
      items: items.map((item) => ({
        product: { id: item.product.id },
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
    };

    try {
      const response = await OrderService.createOrder(orderData);
      if (response.success) {
        setCreatedOrder(response.data as IOrder);
        setShowSuccessDialog(true);
      } else {
        addNotification(response.message || 'Erro ao finalizar pedido.', 'error');
      }
    } catch (error) {
      console.error('Failed to place order', error);
      addNotification('Erro ao finalizar pedido. Tente novamente mais tarde.', 'error');
    }
  };

  const handleSuccessDialogHide = () => {
    clearCart(true);
    setShowSuccessDialog(false);
    setIsOrderSuccessNavigating(true);
    navigate('/orders');
  };

  const successDialogFooter = (
    <div className="text-center">
      <Button
        label="Ver Meus Pedidos"
        icon="pi pi-arrow-right"
        onClick={handleSuccessDialogHide}
        className="success-dialog-button"
      />
    </div>
  );

  const dialogClassName = isMobile ? 'success-dialog-mobile' : 'success-dialog-desktop';

  return (
    <div className="checkout-page">
      <Header />
      <main className="checkout-container">
        <h1>Finalizar Compra</h1>
        <div className="checkout-grid">
          <div className="checkout-steps">
            {/* Step 1: Endereço */}
            <div className="checkout-step">
              <h2 className="step-title">1. Endereço de Entrega</h2>
              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <RadioButton
                        inputId={`address-${address.id}`}
                        name="address"
                        value={address}
                        onChange={(e) => setSelectedAddress(e.value)}
                        checked={selectedAddress?.id === address.id}
                      />
                      <label htmlFor={`address-${address.id}`}>
                        <strong>{address.street}, {address.number}</strong>
                        <p>{address.city}, {address.state} - {address.zipCode}</p>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum endereço encontrado.</p>
              )}
              <Button
                label="Adicionar Novo Endereço"
                icon="pi pi-plus"
                className="p-button-text mt-2"
                onClick={() => navigate('/addresses')}
              />
            </div>

            {/* Step 2: Frete */}
            <div className="checkout-step">
              <h2 className="step-title">2. Método de Envio</h2>
              <div className="shipping-options">
                <div
                  className={`shipping-option ${shippingOption === 'standard' ? 'selected' : ''}`}
                  onClick={() => setShippingOption('standard')}
                >
                  <RadioButton
                    inputId="standard"
                    name="shipping"
                    value="standard"
                    onChange={(e) => setShippingOption(e.value)}
                    checked={shippingOption === 'standard'}
                  />
                  <label htmlFor="standard">
                    <strong>Envio Normal ({formatCurrency(displayStandardCost)})</strong>
                    <p>Receba em até 7 dias úteis</p>
                  </label>
                </div>
                <div
                  className={`shipping-option ${shippingOption === 'express' ? 'selected' : ''}`}
                  onClick={() => setShippingOption('express')}
                >
                  <RadioButton
                    inputId="express"
                    name="shipping"
                    value="express"
                    onChange={(e) => setShippingOption(e.value)}
                    checked={shippingOption === 'express'}
                  />
                  <label htmlFor="express">
                    <strong>Envio Expresso ({formatCurrency(displayExpressCost)})</strong>
                    <p>Receba em até 2 dias úteis</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Pagamento */}
            <div className="checkout-step">
              <h2 className="step-title">3. Forma de Pagamento</h2>
              <div className="payment-options">
                <div
                  className={`payment-option ${paymentMethod === 'CARTAO_CREDITO' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('CARTAO_CREDITO')}
                >
                  <RadioButton
                    inputId="CARTAO_CREDITO"
                    name="payment"
                    value="CARTAO_CREDITO"
                    onChange={(e) => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'CARTAO_CREDITO'}
                  />
                  <label htmlFor="CARTAO_CREDITO">
                    <i className="pi pi-credit-card" /> Cartão de Crédito
                  </label>
                </div>
                <div
                  className={`payment-option ${paymentMethod === 'PIX' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('PIX')}
                >
                  <RadioButton
                    inputId="PIX"
                    name="payment"
                    value="PIX"
                    onChange={(e) => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'PIX'}
                  />
                  <label htmlFor="PIX">
                    <i className="pi pi-qrcode" /> Pix
                  </label>
                </div>
                <div
                  className={`payment-option ${paymentMethod === 'BOLETO' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('BOLETO')}
                >
                  <RadioButton
                    inputId="BOLETO"
                    name="payment"
                    value="BOLETO"
                    onChange={(e) => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'BOLETO'}
                  />
                  <label htmlFor="BOLETO">
                    <i className="pi pi-barcode" /> Boleto Bancário
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="order-summary">
            <h3>Resumo do Pedido</h3>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.product.id} className="summary-item">
                  <img src={item.product.urlImagem} alt={item.product.name} />
                  <div className="item-info">
                    <p>{item.product.name}</p>
                    <p>Qtd: {item.quantity}</p>
                  </div>
                  <p className="item-price">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <div><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div><span>Frete</span><span>{formatCurrency(shippingCost)}</span></div>
              <div className="total"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <Button
              label="Finalizar Compra"
              className="w-full mt-3 finalize-button"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
            />
          </div>
        </div>
      </main>
      <Footer />

      {/* Dialog de sucesso */}
      <Dialog
        header="Pedido Concluído!"
        visible={showSuccessDialog}
        className={dialogClassName}
        footer={successDialogFooter}
        onHide={handleSuccessDialogHide}
        closable={false}
      >
        <div className="success-dialog-content">
          <i className="pi pi-check-circle text-green-500 text-8xl mb-4" />
          <p className="mt-3 text-lg">
            Você pode acompanhar o status<br />
            na página de "Meus Pedidos".
          </p>
          {createdOrder && (
            <div className="text-left mt-4">
              <p><strong>Pedido Nº: #</strong>{createdOrder.id}</p>
              <p><strong>Data:</strong> {new Date(createdOrder.orderDate!).toLocaleDateString('pt-BR')}</p>
              <p><strong>Valor Total:</strong> {formatCurrency(createdOrder.total || 0)}</p>
              <p><strong>Status:</strong> {translateOrderStatus(createdOrder.status)}</p>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

const translateOrderStatus = (status: string | undefined): string => {
  switch (status?.toUpperCase()) {
    case 'AGUARDANDO_PAGAMENTO': return 'Aguardando Pagamento';
    case 'PAGO':                 return 'Pago';
    case 'EM_PREPARACAO':        return 'Em Preparação';
    case 'EM_TRANSPORTE':        return 'Em Transporte';
    case 'CONCLUIDO':            return 'Concluído';
    case 'CANCELADO':            return 'Cancelado';
    default:                     return status || 'Desconhecido';
  }
};

export default CheckoutPage;

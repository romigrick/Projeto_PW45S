import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../services/productService';
import type { IProduct } from '../../commons/types';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { calculateShipping } from '../../lib/shipping';
import './styles.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{ cost: number; time: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID do produto não fornecido.');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await ProductService.findById(Number(id));
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.message || 'Erro ao buscar dados do produto.');
        }
      } catch (err) {
        setError('Ocorreu um erro ao buscar os detalhes do produto.');
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleCalculateShipping = () => {
    if (!cep.trim() || cep.trim().length < 8) {
      return;
    }
    setIsCalculating(true);
    setShippingInfo(null);
    setTimeout(() => {
      if (product) {
        const cost = calculateShipping(product.price * quantity);
        const time = Math.floor(Math.random() * 5) + 3; // Random time: 3-8 days
        setShippingInfo({ cost, time: `em até ${time} dias úteis` });
      }
      setIsCalculating(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="product-page-loading">
        <ProgressSpinner />
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-page-error">
          <i className="pi pi-exclamation-triangle error-icon"></i>
          <h2>Produto não encontrado</h2>
          <p>{error || 'O produto que você está procurando não existe ou foi removido.'}</p>
          <Button label="Voltar para a Loja" icon="pi pi-arrow-left" onClick={() => navigate('/products')} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />
      <main className="product-detail-container">
        <div className="product-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <i className="pi pi-chevron-right" />
          <span onClick={() => navigate('/products')}>Produtos</span>
          <i className="pi pi-chevron-right" />
          <span className="active">{product.name}</span>
        </div>

        <div className="product-content-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img src={product.urlImagem} alt={product.name} className="main-image" />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-rating">
              <i className="pi pi-star-fill text-yellow-500" />
              <i className="pi pi-star-fill text-yellow-500" />
              <i className="pi pi-star-fill text-yellow-500" />
              <i className="pi pi-star-fill text-yellow-500" />
              <i className="pi pi-star text-gray-400" />
              <span className="rating-text">(123 avaliações)</span>
            </div>

            <div className="product-price-section">
              <span className="product-price">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </span>
              <span className="price-installment">
                em até 12x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 12)}
              </span>
            </div>
            
            <p className="product-description">{product.description}</p>

            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantidade:</label>
                <InputNumber 
                  inputId="quantity" 
                  value={quantity} 
                  onValueChange={(e) => setQuantity(e.value ?? 1)} 
                  showButtons 
                  min={1} 
                  max={99}
                  inputClassName="quantity-input-field"
                />
              </div>
              <Button 
                label="Adicionar ao Carrinho" 
                icon="pi pi-shopping-cart" 
                className="add-to-cart-button" 
                onClick={handleAddToCart} 
              />
            </div>
            
            <div className="shipping-calculator">
              <p className="font-bold">Calcular frete e prazo</p>
              <div className="p-inputgroup">
                <InputText placeholder="Digite seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
                <Button label="Calcular" onClick={handleCalculateShipping} loading={isCalculating} />
              </div>
              {shippingInfo && (
                <div className="shipping-result">
                  <p>
                    <i className="pi pi-truck" />
                    <span> Receba {shippingInfo.time}: <strong>{shippingInfo.cost === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingInfo.cost)}</strong></span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

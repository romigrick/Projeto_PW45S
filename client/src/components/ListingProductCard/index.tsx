import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import type { IProduct, ListingProductCardProps } from '../../commons/types';

const ListingProductCard = ({ product }: ListingProductCardProps) => {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',  
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    width: '280px',  
    minHeight: '400px',  
    alignItems: 'center',  
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '9rem',
    objectFit: 'contain',
    alignSelf: 'center'
  };

  const starsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.125rem',
    justifyContent: 'center',  
    marginBottom: '8px'
  };

  const starStyle = (filled: boolean): React.CSSProperties => ({
    fontSize: '0.75rem',
    color: filled ? '#fb923c' : '#d1d5db'
  });

  const reviewCountStyle: React.CSSProperties = {
    marginLeft: '0.25rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  };

  const titleStyle: React.CSSProperties = {
    marginTop: '1rem',
    fontSize: '1rem',  
    color: '#374151',
    overflow: 'hidden',
    fontWeight: 'bold',
    minHeight: '2.5rem',  
    textAlign: 'center',  
  };

  const pricingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',  
  };

  const newPriceStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626'
  };

  const pixInfoStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#059669'
  };

  const installmentsStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: 0 
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    width: '100%',
    backgroundColor: '#ff6600',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer'
  };

  const renderStars = (rating: number = 5, reviewCount: number = 980) => {
    let stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className="pi pi-star-fill"
          style={starStyle(i <= rating)}
        />
      );
    }
    stars.push(<span key="count" style={reviewCountStyle}>({reviewCount})</span>);
    return <div style={starsContainerStyle}>{stars}</div>;
  };

  return (
    <Link to={`/product/${product.id}`} style={cardStyle}>
      {renderStars()}
      <img
        src={product.urlImagem || 'https://placehold.co/150x150/eee/333?text=Produto'}
        alt={product.name}
        style={imageStyle}
      />
      <p style={titleStyle}>
        {product.name}
      </p>

      <div style={pricingStyle}>
        <div style={newPriceStyle}>
          {formatPrice(product.price)}
        </div>
        <p style={pixInfoStyle}>à vista no PIX</p>
        <p style={installmentsStyle}>ou 10x de {formatPrice(product.price / 10)}</p>

        <button style={buttonStyle} onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </button>
      </div>
    </Link>
  );
};

export default ListingProductCard;

import React, { useEffect, useState } from 'react';
import ProductService from '../../services/productService';
import type { IProduct } from '../../commons/types';
import ProductCard from '../ProductCard/index';

const ProductSection = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.findAll();
        if (response.success && response.data) {
          setProducts(response.data as IProduct[]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Estilos inline
  const productSectionStyle = {
    padding: '2rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.8rem',
    color: '#ff6600',
    marginBottom: '1.5rem',
    textAlign: 'center'
  };

  const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    justifyItems: 'center'
  };

  const loadingStyle = {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666'
  };

  return (
    <section style={productSectionStyle}>
      <h2 style={sectionTitleStyle}>As Melhores Ofertas</h2>
      <div style={productGridStyle}>
        {loading ? (
          <div style={loadingStyle}>Carregando produtos...</div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductSection;

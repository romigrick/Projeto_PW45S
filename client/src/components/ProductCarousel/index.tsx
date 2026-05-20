import React, { useEffect, useState } from 'react';
import ProductService from '../../services/productService';
import type { IProduct } from '../../commons/types';
import ListingProductCard from '../ListingProductCard/index';

const ProductCarousel = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.findAll();
        if (response.success && response.data) {
          const allProducts = response.data as IProduct[];
          const sortedAndLimitedProducts = allProducts
            .sort((a, b) => b.price - a.price) 
            .slice(0, 10); 
          setProducts(sortedAndLimitedProducts);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <section className="my-6">
      <div className="relative">
      
        <div className="flex overflow-x-auto pb-4 gap-4 px-4">
          {loading ? (
            <div className="text-center w-full py-8">Carregando produtos...</div>
          ) : (
            products.map(product => (
              <div key={product.id} className="flex-shrink-0">
                <ListingProductCard product={product} />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

export default ProductCarousel;

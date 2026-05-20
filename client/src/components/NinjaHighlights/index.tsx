import React, { useEffect, useState } from 'react';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import type { IProduct, ICategory } from '../../commons/types';
import ListingProductCard from '../ListingProductCard/index';

const NinjaHighlights = () => {
  const [categories, setCategories] = useState<string[]>(["TODOS"]);
  const [activeTab, setActiveTab] = useState("TODOS");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.findAll();
        if (response.success && response.data) {
          const categoryNames = (response.data as ICategory[]).map(cat => cat.name);
          setCategories(["TODOS", ...categoryNames]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (activeTab === "TODOS") {
          response = await ProductService.findAll();
        } else {
          response = await ProductService.findByCategoryName(activeTab);
        }
        if (response.success && response.data) {
          const filteredProducts = (response.data as IProduct[]).filter(
            (product) => product.price < 1000
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  // Estilos inline
  const ninjaSectionStyle = {
    padding: '3rem 1rem',
    backgroundColor: 'transparent'
  };

  const ninjaHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    maxWidth: '1280px',
    margin: '0 auto 2rem auto'
  };

  const ninjaTitleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const ninjaTitleDecoratorStyle = {
    width: '4px',
    height: '2rem',
    backgroundColor: '#ff6600'
  };

  const ninjaTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0'
  };

  const ninjaViewAllStyle = {
    color: '#ff6600',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem'
  };

  const tabsContainerStyle = {
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const tabsScrollAreaStyle = {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: isActive ? '#ff6600' : '#e5e7eb',
    color: isActive ? 'white' : '#374151',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  });

  const carouselContainerStyle = {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const carouselButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: 10
  };

  const carouselScrollAreaStyle = {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    padding: '1rem',
    scrollBehavior: 'smooth'
  };

  return (
    <section style={ninjaSectionStyle}>
      <div style={ninjaHeaderStyle}>
        <div style={ninjaTitleContainerStyle}>
          <span style={ninjaTitleDecoratorStyle}></span>
          <h2 style={ninjaTitleStyle}>DESTAQUES NINJA</h2>
        </div>
        <a href="#" style={ninjaViewAllStyle}>
          VER TODOS {'>'}
        </a>
      </div>

      {/* Abas de Categoria */}
      <div style={tabsContainerStyle}>
        <div style={tabsScrollAreaStyle}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              style={tabButtonStyle(activeTab === category)}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Carrossel de Produtos Ninja */}
      <div style={carouselContainerStyle}>

        <div style={carouselScrollAreaStyle}>
          {loading ? (
            <div className="text-center w-full py-8">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="text-center w-full py-8 text-gray-500">
              Nenhum produto encontrado para esta categoria.
            </div>
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

export default NinjaHighlights;

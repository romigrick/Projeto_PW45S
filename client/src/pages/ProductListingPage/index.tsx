import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import type { IProduct, ICategory, ListingProductCardProps } from '../../commons/types';
import ListingProductCard from '../../components/ListingProductCard';
import bannerImage from '../../assets/1761763638esquenta-black-das-blacks.webp';

interface FilterSidebarProps {
  categories: ICategory[];
  selectedCategory: string;
  onCategoryChange: (categoryName: string) => void;
  freeShippingOnly: boolean;
  onFreeShippingChange: (checked: boolean) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (price: number | null) => void;
  onMaxPriceChange: (price: number | null) => void;
  style: React.CSSProperties;  
}

 
function FilterSidebar({ categories, selectedCategory, onCategoryChange, freeShippingOnly, onFreeShippingChange, minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, style }: FilterSidebarProps) {

  const [categoryExpanded, setCategoryExpanded] = useState(true);  

  const [priceExpanded, setPriceExpanded] = useState(true);

  const [benefitsExpanded, setBenefitsExpanded] = useState(true);




  useEffect(() => {

    const handleResize = () => {

      const isMobileView = window.innerWidth < 768;

      setCategoryExpanded(!isMobileView);

      setPriceExpanded(!isMobileView);

      setBenefitsExpanded(!isMobileView);

    };



    window.addEventListener('resize', handleResize);

    handleResize();  

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  const categoryTitleStyle = {

    fontWeight: 'bold',

    color: '#1f2937',

    fontSize: '1.125rem',

    marginBottom: '0.5rem'

  };

  const optionsStyle = {
    marginTop: '1rem',
    marginBottom: '1rem'
  };

  const categoryOptionStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: active ? '#ff6600' : '#374151',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    fontWeight: active ? 'bold' : 'normal'
  });
  
  const filterGroupStyle = {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
    paddingBottom: '1rem'
  };

  const optionLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    marginBottom: '0.5rem'
  };

  const checkboxStyle = {
    marginRight: '0.5rem'
  };

  const priceInputContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  }

  return (
    <aside style={style}>

      <div style={{...filterGroupStyle, borderTop: 'none'}}> 
        <div style={categoryTitleStyle} onClick={() => setCategoryExpanded(!categoryExpanded)} className="cursor-pointer flex justify-content-between align-items-center">
          <h3>Filtrar por Categoria</h3>
          <i className={categoryExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"} />
        </div>
        {categoryExpanded && (
          <div style={optionsStyle}>
            <label style={categoryOptionStyle(!selectedCategory)} onClick={() => onCategoryChange('')}>
              <input
                type="radio"
                name="category"
                checked={!selectedCategory}
                onChange={() => onCategoryChange('')}
                style={{ marginRight: '0.5rem' }}
              />
              TODOS
            </label>
            {categories.map(category => (
              <label key={category.id} style={categoryOptionStyle(selectedCategory === category.name)} onClick={() => onCategoryChange(category.name)}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.name}
                  onChange={() => onCategoryChange(category.name)}
                  style={{ marginRight: '0.5rem' }}
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div style={filterGroupStyle}>
        <div style={categoryTitleStyle} onClick={() => setPriceExpanded(!priceExpanded)} className="cursor-pointer flex justify-content-between align-items-center">
          <h4>Faixa de Preço</h4>
          <i className={priceExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"} />
        </div>
        {priceExpanded && (
          <div style={optionsStyle}>
            <div style={priceInputContainerStyle}>
               <InputNumber inputId="min-price" value={minPrice} onValueChange={(e) => onMinPriceChange(e.value ?? null)} mode="currency" currency="BRL" locale="pt-BR" placeholder="Mínimo" inputStyle={{width: '100px'}}/>
               <span>-</span>
               <InputNumber inputId="max-price" value={maxPrice} onValueChange={(e) => onMaxPriceChange(e.value ?? null)} mode="currency" currency="BRL" locale="pt-BR" placeholder="Máximo" inputStyle={{width: '100px'}}/>
            </div>
          </div>
        )}
      </div>

      <div style={filterGroupStyle}>
        <div style={categoryTitleStyle} onClick={() => setBenefitsExpanded(!benefitsExpanded)} className="cursor-pointer flex justify-content-between align-items-center">
          <h4>Benefícios</h4>
          <i className={benefitsExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"} />
        </div>
        {benefitsExpanded && (
          <div style={optionsStyle}>
              <label style={optionLabelStyle}>
                <Checkbox
                  checked={freeShippingOnly}
                  onChange={(e) => onFreeShippingChange(e.checked ?? false)}
                  style={checkboxStyle}
                />
                <span style={{ flex: 1 }}>Frete Grátis</span>
              </label>
          </div>
        )}
      </div>
    </aside>
  );
}

 
export default function ProductListingPage() {
  const location = useLocation();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('Mais procurados');
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category') || '';
  const searchFromUrl = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>(searchFromUrl);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category') || '';
    const searchFromUrl = searchParams.get('search') || '';
    setSelectedCategory(categoryFromUrl);
    setSearchQuery(searchFromUrl);
    setCurrentPage(0);
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data as ICategory[]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory) {
          response = await ProductService.findByCategoryName(selectedCategory);
        } else {
          response = await ProductService.findAll();
        }
        if (response.success && response.data) {
          let fetchedProducts = response.data as IProduct[];

          if (searchQuery) {
            fetchedProducts = fetchedProducts.filter(product =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          if (freeShippingOnly) {
            fetchedProducts = fetchedProducts.filter(product => product.price > 200);
          }

          if (minPrice !== null) {
            fetchedProducts = fetchedProducts.filter(product => product.price >= minPrice);
          }
    
          if (maxPrice !== null) {
            fetchedProducts = fetchedProducts.filter(product => product.price <= maxPrice);
          }

          if (sortOrder !== 'Mais procurados') {
            fetchedProducts = [...fetchedProducts].sort((a, b) => {
              if (sortOrder === 'Menor preço') {
                return Number(a.price) - Number(b.price);
              } else if (sortOrder === 'Maior preço') {
                return Number(b.price) - Number(a.price);
              } else if (sortOrder === 'Mais vendidos') {
                return (b.id || 0) - (a.id || 0);
              }
              return 0;
            });
          }

          let totalElements = fetchedProducts.length;
          let totalPages = Math.ceil(totalElements / pageSize);

          fetchedProducts = fetchedProducts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

          setProducts(fetchedProducts);
          setTotalElements(totalElements);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, selectedCategory, sortOrder, searchQuery, freeShippingOnly, minPrice, maxPrice]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage(0);
  };

  const handleFreeShippingChange = (checked: boolean) => {
    setFreeShippingOnly(checked);
    setCurrentPage(0);
  }

  const handleMinPriceChange = (price: number | null) => {
    setMinPrice(price);
    setCurrentPage(0);
  }

  const handleMaxPriceChange = (price: number | null) => {
    setMaxPrice(price);
    setCurrentPage(0);
  }

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  };

  const breadcrumbStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '1rem'
  };

  const bannerStyle = {
    width: '100%',
    height: '12rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    overflow: 'hidden'
  };

  const bannerImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  };

  const offerBarStyle = {
    backgroundColor: '#ff6600',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    marginBottom: '1.5rem'
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? ('column' as const) : ('row' as const),
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '25%',
    paddingRight: isMobile ? '0' : '2rem',
    marginBottom: isMobile ? '1.5rem' : '0'  
  };

  const mainStyle = {
    width: isMobile ? '100%' : '75%'
  };

  const controlsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  };

  const controlsLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const labelStyle = {
    fontSize: '0.875rem'
  };

  const selectStyle = {
    marginLeft: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    fontSize: '0.875rem'
  };

  const controlsRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))'
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
    gap: '0.5rem'
  };

  const pageButtonStyle = (active: boolean) => ({
    padding: '0.5rem 1rem',
    border: active ? '1px solid #ff6600' : '1px solid #d1d5db',
    backgroundColor: active ? '#ff6600' : 'white',
    color: active ? 'white' : '#374151',
    borderRadius: '0.375rem',
    cursor: 'pointer'
  });

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={breadcrumbStyle}>
          Você está em: <a href="/" style={{ color: '#ff6600', textDecoration: 'none' }}>Home</a>
          {searchQuery && (
            <>
              {' / '}
              <span>Busca por "{searchQuery}"</span>
            </>
          )}
          {selectedCategory && !searchQuery && (
            <>
              {' / '}
              <span>{selectedCategory}</span>
            </>
          )}
        </div>

        <div style={bannerStyle}>
          <img src={bannerImage} alt="Dell Products" style={bannerImageStyle} />
        </div>

        <div style={offerBarStyle}>
          Ofertas em {selectedCategory || 'Todos'}
        </div>

        <div style={mainContentStyle}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            freeShippingOnly={freeShippingOnly}
            onFreeShippingChange={handleFreeShippingChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            style={sidebarStyle}  
          />

          <main style={mainStyle}>
            <div style={controlsStyle}>
              <div style={controlsLeftStyle}>
                <label style={labelStyle}>
                  Ordernar:
                  <select style={selectStyle} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option>Mais procurados</option>
                    <option>Mais vendidos</option>
                    <option>Menor preço</option>
                    <option>Maior preço</option>
                  </select>
                </label>
                <label style={labelStyle}>
                  Exibir:
                  <select style={selectStyle} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                  </select>
                </label>
              </div>
              <div style={controlsRightStyle}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{totalElements} produtos</span>
              </div>
            </div>

            <div style={gridStyle}>
              {loading ? (
                <div className="text-center w-full py-8">Carregando produtos...</div>
              ) : (
                products.map(product => (
                  <ListingProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  style={pageButtonStyle(false)}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <i className="pi pi-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    style={pageButtonStyle(i === currentPage)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  style={pageButtonStyle(false)}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  <i className="pi pi-chevron-right" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

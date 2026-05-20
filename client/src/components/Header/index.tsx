import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '../../context/CartContext';
import CategoryService from '../../services/categoryService';
import type { ICategory } from '../../commons/types';
import logoImage from '@/assets/katchau_logo.png';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import { OverlayPanel } from 'primereact/overlaypanel';
import './styles.css';

interface AuthDisplayProps {
  authenticated: boolean;
  authenticatedUser: { displayName?: string } | null;
  handleLogout: () => void;
  navigate: (path: string) => void;
  isMobile: boolean;
}

const AuthDisplay: React.FC<AuthDisplayProps> = ({ authenticated, authenticatedUser, handleLogout, navigate, isMobile }) => {
  const userMenuRef = useRef<OverlayPanel>(null);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  const userMenuItems = [
    {
      label: 'Minha Conta',
      icon: 'pi pi-user',
      command: () => { navigate('/account'); if (isMobile) setMobileUserMenuOpen(false); }
    },
    {
      label: 'Meus Pedidos',
      icon: 'pi pi-shopping-bag',
      command: () => { navigate('/orders'); if (isMobile) setMobileUserMenuOpen(false); }
    },
    {
      label: 'Meus Dados',
      icon: 'pi pi-id-card',
      command: () => { navigate('/account'); if (isMobile) setMobileUserMenuOpen(false); }
    },
    {
      label: 'Endereço',
      icon: 'pi pi-map-marker',
      command: () => { navigate('/addresses'); if (isMobile) setMobileUserMenuOpen(false); }
    },
    {
      separator: true
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => { handleLogout(); if (isMobile) setMobileUserMenuOpen(false); }
    }
  ];

  if (authenticated) {
    if (isMobile) {
      return (
        <div className="auth-display-mobile relative w-full" onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}>
          <i className="pi pi-user text-orange-500 text-3xl" />
          <div className="text-xs">
            <div>Olá,</div>
            <div className="font-bold">{authenticatedUser?.displayName}</div>
          </div>
          <i className={`pi ${mobileUserMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} ml-auto`}></i>
          {mobileUserMenuOpen && (
            <div className="user-menu-mobile-dropdown">
              <Menu model={userMenuItems} className="user-menu-mobile" />
            </div>
          )}
        </div>
      );
    } else { 
      return (
        <div className="auth-display-desktop" onClick={(e) => userMenuRef.current?.toggle(e)}>
          <span className="user-greeting">Olá, {authenticatedUser?.displayName}</span>
          <i className="pi pi-chevron-down" />
          <OverlayPanel ref={userMenuRef} className="user-menu-overlay">
            <Menu model={userMenuItems} className="user-menu-desktop" />
          </OverlayPanel>
        </div>
      );
    }
  }

  if (isMobile) {
    return (
      <Link to="/login" className="auth-display-mobile no-underline" onClick={() => navigate('/login')}>
        <i className="pi pi-user text-orange-500 text-3xl" />
        <div className="text-xs">
          <div>Entre ou</div>
          <div className="font-bold">Cadastre-se</div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link to="/login" className="login-desktop">
        <i className="pi pi-user" />
        <span>Entrar</span>
      </Link>
    );
  }
};

const userMenuItemsForMobile = (
    navigate: (path: string) => void,
    handleLogout: () => void,
    setMobileMenuOpen: (open: boolean) => void,
    setMobileUserMenuOpen: (open: boolean) => void
  ) => [
    {
      label: 'Minha Conta',
      icon: 'pi pi-user',
      command: () => { navigate('/account'); setMobileMenuOpen(false); setMobileUserMenuOpen(false); }
    },
    {
      label: 'Meus Pedidos',
      icon: 'pi pi-shopping-bag',
      command: () => { navigate('/orders'); setMobileMenuOpen(false); setMobileUserMenuOpen(false); }
    },
    {
      label: 'Meus Dados',
      icon: 'pi pi-id-card',
      command: () => { navigate('/account'); setMobileMenuOpen(false); setMobileUserMenuOpen(false); }
    },
    {
      label: 'Endereço',
      icon: 'pi pi-map-marker',
      command: () => { navigate('/addresses'); setMobileMenuOpen(false); setMobileUserMenuOpen(false); }
    },
    {
      separator: true
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => { handleLogout(); setMobileMenuOpen(false); setMobileUserMenuOpen(false); }
    }
  ];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { authenticated, authenticatedUser, handleLogout } = useAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { items: cartItems } = useCart();
  const navigate = useNavigate();
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/">
              <img src={logoImage} alt="Katchau Logo" className="logo-image" />
            </Link>
          </div>

          <div className="hidden lg:flex align-items-center gap-4 flex-grow-1 min-w-0 mx-6">
            <div className="send-to-desktop">
              <i className="pi pi-map-marker" />
              <div className="text-xs">
                <div>Enviar para</div>
                <div className="font-bold">Digite o CEP</div>
              </div>
            </div>
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Busque no Katchau!"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="search-button" onClick={handleSearch}><i className="pi pi-search" /></button>
            </div>
          </div>

          <div className="hidden lg:flex align-items-center gap-6">
            <div className="actions-desktop">
              <a href="#" className="action-icon"><i className="pi pi-star" /></a>
              <a href="#" className="action-icon"><i className="pi pi-bell" /></a>
              <a href="#" className="action-icon"><i className="pi pi-heart" /></a>
              <Link to="/cart" className="p-overlay-badge cart-icon">
                <i className="pi pi-shopping-cart" />
                {cartItems.length > 0 && <Badge value={cartItems.length} severity="danger"></Badge>}
              </Link>
            </div>
            <AuthDisplay authenticated={authenticated} authenticatedUser={authenticatedUser} handleLogout={handleLogout} navigate={navigate} isMobile={isMobile} />
          </div>

          <div className="block lg:hidden flex align-items-center gap-4">
            <AuthDisplay authenticated={authenticated} authenticatedUser={authenticatedUser} handleLogout={handleLogout} navigate={navigate} isMobile={isMobile} />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-menu-button lg:hidden"
            >
              <i className="pi pi-bars" />
            </button>
          </div>
        </div>
      </div>

      <nav className="navbar-desktop hidden lg:block">
        <div className="navbar-container">
          <div
            className="relative h-full"
            onMouseEnter={() => setIsCategoryMenuVisible(true)}
            onMouseLeave={() => setIsCategoryMenuVisible(false)}
          >
            <Link to="/products" className="offer-link">
              <i className="pi pi-tag" />
              <span>TODOS</span>
              <i className="pi pi-chevron-down" />
            </Link>
            {isCategoryMenuVisible && (
              <div className="category-dropdown">
                {categories.map(category => (
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    key={category.id}
                    className="category-link"
                    onClick={() => setIsCategoryMenuVisible(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="navbar-flex-container">
            {categories.slice(0, 5).map(category => (
              <Link to={`/products?category=${category.name}`} key={category.id} className="nav-link">{category.name}</Link>
            ))}
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div
          className={`mobile-menu-content ${mobileMenuOpen ? 'active' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-header">
            {authenticated ? (
              <div
                className="mobile-login relative cursor-pointer"
                onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
              >
                <i className="pi pi-user text-orange-500 text-3xl" />
                <div className="text-xs">
                  <div>Olá,</div>
                  <div className="font-bold">{authenticatedUser?.displayName}</div>
                </div>
                <i className={`pi ${mobileUserMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} ml-auto`}></i>
                {mobileUserMenuOpen && (
                  <div className="user-menu-mobile-dropdown">
                    <Menu model={userMenuItemsForMobile(navigate, handleLogout, setMobileMenuOpen, setMobileUserMenuOpen)} className="user-menu-mobile" />
                  </div>
                )}
              </div>
            ) : (
              null
            )}
            <button onClick={() => setMobileMenuOpen(false)} className="close-button">
              <i className="pi pi-times" />
            </button>
          </div>

          <div className="mobile-send-to">
            <i className="pi pi-map-marker text-orange-500 text-2xl" />
            <div className="text-xs">
              <div>Enviar para</div>
              <div className="font-bold">Digite o CEP</div>
            </div>
          </div>

          <nav className="mobile-nav">
            <Link to={`/products`} className="mobile-nav-link-offer" onClick={() => setMobileMenuOpen(false)}><span>TODOS</span><i className="pi pi-chevron-right" /></Link>
            {categories.map(category => (
              <Link to={`/products?category=${category.name}`} key={category.id} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}><span>{category.name}</span><i className="pi pi-chevron-right" /></Link>
            ))}
          </nav>

          <div className="mobile-actions">
            <a href="#" className="mobile-action-icon"><i className="pi pi-bell" /></a>
            <a href="#" className="mobile-action-icon"><i className="pi pi-heart" /></a>
            <Link to="/cart" className="p-overlay-badge mobile-action-icon" onClick={() => setMobileMenuOpen(false)}>
                <i className="pi pi-shopping-cart" />
                {cartItems.length > 0 && <Badge value={cartItems.length} severity="danger"></Badge>}
            </Link>
            {authenticated && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setMobileMenuOpen(false); }} className="mobile-action-icon">
                <i className="pi pi-sign-out" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

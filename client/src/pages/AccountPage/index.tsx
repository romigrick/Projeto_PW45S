import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'primereact/button';
import './styles.css';

const AccountPage: React.FC = () => {
  const auth = useAuth() as any;
  const { authenticatedUser, handleLogout } = auth;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const getMenuItemClass = (tabName: string) => {
    return `menu-item ${activeTab === tabName ? 'active' : ''}`;
  };

  return (
    <>
      <Header />
      <div className="container-geral">
        <div className="breadcrumb">
          Você está em: <a href="/">Home</a> / Minha Conta
        </div>

        <h1 className="main-title">Minha Conta</h1>

        <div className="account-content">
          <div className="account-sidebar">
            <h2 className="sidebar-title">Menu da Conta</h2>
            <div
              className={getMenuItemClass('profile')}
              onClick={() => setActiveTab('profile')}
            >
              Meus Dados
            </div>
            <div
              className={getMenuItemClass('orders')}
              onClick={() => navigate('/orders')}
            >
              Meus Pedidos
            </div>
            <div
              className={getMenuItemClass('addresses')}
              onClick={() => navigate('/addresses')}
            >
              Endereços
            </div>
            <button
              className="btn-logout"
              onClick={handleLogoutClick}
            >
              Sair
            </button>
          </div>

          <div className="account-main">
            {activeTab === 'profile' && (
              <div>
                <h2 className="section-title">Meus Dados</h2>
                <form>
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-input"
                      value={authenticatedUser?.displayName || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nome de Usuário</label>
                    <input
                      type="text"
                      className="form-input"
                      value={authenticatedUser?.username || ''}
                      readOnly
                    />
                  </div>
                  <button type="button" className="btn-primary">
                    Editar Perfil
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="section-title">Meus Pedidos</h2>
                <div className="flex justify-between items-center mb-4">
                  <p>Histórico de pedidos será exibido aqui.</p>
                  <Button
                    label="Ver Todos os Pedidos"
                    icon="pi pi-list"
                    onClick={() => navigate('/orders')}
                    className="p-button-outlined"
                  />
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="section-title">Endereços</h2>
                <p>Gerencie seus endereços de entrega.</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/addresses')}
                >
                  Gerenciar Endereços
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountPage;
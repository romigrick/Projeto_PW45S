import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import AddressService from '../../services/addressService';
import type { IAddress } from '../../commons/types';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import './styles.css';

const AddressPage = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await AddressService.getUserAddresses();
      if (response.success && response.data) {
        setAddresses(response.data as IAddress[]);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (addressData: Omit<IAddress, 'id'>) => {
    try {
      const response = await AddressService.createAddress(addressData);
      if (response.success) {
        alert('Endereço criado com sucesso!');
        setShowForm(false);
        loadAddresses();
      } else {
        alert('Erro ao criar endereço: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      alert('Erro ao criar endereço. Tente novamente.');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }

    try {
      const response = await AddressService.deleteAddress(id);
      if (response.success) {
        alert('Endereço excluído com sucesso!');
        loadAddresses();
      } else {
        alert('Erro ao excluir endereço: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      alert('Erro ao excluir endereço. Tente novamente.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="address-container">
          <div className="loading-container">
            Carregando endereços...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="address-container">
        <div className="breadcrumb">
          Você está em: <a href="/" className="breadcrumb-link">Home</a> / Endereços
        </div>

        <div className="address-header">
          <h1 className="address-title">Meus Endereços</h1>
          <button
            className="add-address-button"
            onClick={() => setShowForm(true)}
          >
            Adicionar Endereço
          </button>
        </div>

        {showForm && (
          <AddressForm
            address={null}
            onSubmit={handleCreateAddress}
            onCancel={handleCancelForm}
          />
        )}

        <AddressList
          addresses={addresses}
          onDelete={handleDeleteAddress}
        />
      </div>
      <Footer />
    </>
  );
};

export default AddressPage;

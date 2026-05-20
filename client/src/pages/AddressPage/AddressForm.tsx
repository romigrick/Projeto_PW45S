import React, { useState, useEffect } from 'react';
import type { IAddress } from '../../commons/types';
import axios from 'axios';

interface AddressFormProps {
  onSubmit: (addressData: Omit<IAddress, 'id'>) => void;
  onCancel: () => void;
  address: IAddress | null;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onCancel, address }) => {
  const [formData, setFormData] = useState<Omit<IAddress, 'id'>>({
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  });

  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street,
        number: address.number,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      });
    }
  }, [address]);


  const fetchAddress = async (zipCode: string) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
      const { logradouro, localidade, uf } = response.data;
      setFormData(prev => ({
        ...prev,
        street: logradouro,
        city: localidade,
        state: uf
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const zipCode = formData.zipCode.replace(/\D/g, '');
    if (zipCode.length === 8) {
      fetchAddress(zipCode);
    }
  }, [formData.zipCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h2>
        {address ? 'Editar Endereço' : 'Novo Endereço'}
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">CEP *</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="form-input"
            required
            maxLength={9}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rua *</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Número *</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cidade *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Estado *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">País *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-input"
            required
            disabled
          />
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="btn-submit">
          Salvar
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

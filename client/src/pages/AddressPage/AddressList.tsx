import React from 'react';
import type { IAddress } from '../../commons/types';

interface AddressListProps {
  addresses: IAddress[];
  onDelete: (id: number) => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onDelete }) => {
  if (addresses.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nenhum endereço cadastrado</h3>
        <p>
          Adicione seu primeiro endereço para continuar comprando.
        </p>
      </div>
    );
  }

  return (
    <div className="address-list">
      {addresses.map((address) => (
        <div key={address.id} className="address-card">
          <div>
            <h3 className="address-card-title">
              {address.street}, {address.number}
            </h3>
            <p className="address-text">
              {address.city}, {address.state} - {address.zipCode} | {address.country}
            </p>
          </div>
          <div className="address-buttons">
            <button
              className="btn-delete"
              onClick={() => address.id && onDelete(address.id)}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;

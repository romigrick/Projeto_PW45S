import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import OrderService from '../../services/orderService';
import type { IOrder } from '../../commons/types';

const STATUS_SEVERITY: Record<string, 'warning' | 'success' | 'info' | 'danger' | undefined> = {
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'success',
  EM_PREPARACAO: 'info',
  EM_TRANSPORTE: 'info',
  CONCLUIDO: 'success',
  CANCELADO: 'danger',
};

const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em Preparação',
  EM_TRANSPORTE: 'Em Transporte',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

const STATUS_ICONS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'pi-clock',
  PAGO: 'pi-check-circle',
  EM_PREPARACAO: 'pi-box',
  EM_TRANSPORTE: 'pi-truck',
  CONCLUIDO: 'pi-check',
  CANCELADO: 'pi-times-circle',
};

const STATUS_COLORS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#f59e0b',
  PAGO: '#22c55e',
  EM_PREPARACAO: '#8b5cf6',
  EM_TRANSPORTE: '#3b82f6',
  CONCLUIDO: '#10b981',
  CANCELADO: '#ef4444',
};

const summaryCard = (
  label: string,
  value: React.ReactNode,
  iconClass: string,
  iconColor: string,
  bgColor: string,
  borderColor: string
) => (
  <div
    className="surface-card shadow-2 border-round p-3"
    style={{ borderTop: `3px solid ${borderColor}` }}
  >
    <div className="flex align-items-center justify-content-between">
      <div>
        <span className="block text-500 font-medium mb-2 text-sm">{label}</span>
        <div className="font-bold text-3xl" style={{ color: iconColor }}>{value}</div>
      </div>
      <div
        className="w-3rem h-3rem border-round flex align-items-center justify-content-center"
        style={{ backgroundColor: bgColor }}
      >
        <i className={`pi ${iconClass} text-xl`} style={{ color: iconColor }} />
      </div>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    OrderService.getAllOrders().then((response) => {
      if (response.success) setOrders(response.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  const statusCount = orders.reduce((acc, order) => {
    const s = order.status || 'UNKNOWN';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = orders
    .filter((o) => o.status === 'PAGO' || o.status === 'CONCLUIDO')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const statusTemplate = (rowData: IOrder) => (
    <Tag
      severity={STATUS_SEVERITY[rowData.status || '']}
      value={STATUS_LABELS[rowData.status || ''] || rowData.status}
    />
  );

  const dateTemplate = (rowData: IOrder) => {
    if (!rowData.createdAt) return '-';
    return new Date(rowData.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const totalTemplate = (rowData: IOrder) =>
    rowData.total ? `R$ ${rowData.total.toFixed(2).replace('.', ',')}` : '-';

  return (
    <div>
      {/* Page title */}
      <div className="flex align-items-center justify-content-between mb-4">
        <h1 className="text-3xl font-bold text-900 m-0">Painel Administrativo</h1>
        <Button
          label="Ver todos pedidos"
          icon="pi pi-list"
          className="p-button-outlined"
          onClick={() => navigate('/admin/orders')}
        />
      </div>

      {/* Top 4 summary cards — plain divs, mesmo estilo do projeto */}
      <div
        className="mb-4"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}
      >
        {summaryCard('Total de Pedidos', orders.length, 'pi-shopping-cart', '#3b82f6', '#dbeafe', '#3b82f6')}
        {summaryCard(
          'Receita (Pago/Concluído)',
          `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
          'pi-dollar', '#22c55e', '#dcfce7', '#22c55e'
        )}
        {summaryCard('Aguardando Pagamento', statusCount['AGUARDANDO_PAGAMENTO'] || 0, 'pi-clock', '#f59e0b', '#fef3c7', '#f59e0b')}
        {summaryCard('Em Transporte', statusCount['EM_TRANSPORTE'] || 0, 'pi-truck', '#06b6d4', '#cffafe', '#06b6d4')}
      </div>

      {/* Status breakdown — 5 cards in one row */}
      <div
        className="mb-4"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 2fr)', gap: '1rem' }}
      >
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div
            key={status}
            className="surface-card shadow-2 border-round p-3 text-center cursor-pointer hover:surface-100 transition-colors transition-duration-150"
            onClick={() => navigate('/admin/orders')}
            style={{ borderTop: `3px solid ${STATUS_COLORS[status]}` }}
          >
            <i
              className={`pi ${STATUS_ICONS[status]} text-xl mb-2 block`}
              style={{ color: STATUS_COLORS[status] }}
            />
            <span className="block text-500 text-xs mb-1">{label}</span>
            <span className="block font-bold text-2xl text-900">{statusCount[status] || 0}</span>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="surface-card shadow-2 border-round p-3">
        <div className="flex align-items-center justify-content-between mb-3">
          <h3 className="m-0 text-800 font-semibold">Pedidos Recentes</h3>
          <Button
            label="Ver todos"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-text p-button-sm"
            onClick={() => navigate('/admin/orders')}
          />
        </div>
        <DataTable
          value={recentOrders}
          className="p-datatable-sm"
          emptyMessage="Nenhum pedido encontrado."
          stripedRows
        >
          <Column field="id" header="# Pedido" style={{ width: '8rem' }} />
          <Column header="Data" body={dateTemplate} />
          <Column field="paymentMethod" header="Pagamento" />
          <Column header="Total" body={totalTemplate} />
          <Column header="Status" body={statusTemplate} />
          <Column
            header=""
            body={(row: IOrder) => (
              <Button
                icon="pi pi-eye"
                className="p-button-rounded p-button-text p-button-sm"
                onClick={() => navigate(`/admin/orders/${row.id}`)}
              />
            )}
            style={{ width: '4rem' }}
          />
        </DataTable>
      </div>
    </div>
  );
};

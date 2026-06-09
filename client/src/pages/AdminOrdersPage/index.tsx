import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import OrderService from '../../services/orderService';
import type { IOrder } from '../../commons/types';

const STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Aguardando Pagamento', value: 'AGUARDANDO_PAGAMENTO' },
  { label: 'Pago', value: 'PAGO' },
  { label: 'Em Preparação', value: 'EM_PREPARACAO' },
  { label: 'Em Transporte', value: 'EM_TRANSPORTE' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em Preparação',
  EM_TRANSPORTE: 'Em Transporte',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const response = await OrderService.getAllOrders();
    if (response.success) {
      setOrders(response.data || []);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao carregar pedidos',
        life: 3000,
      });
    }
    setLoading(false);
  };

  const statusTemplate = (rowData: IOrder) => {
    const status = rowData.status || 'UNKNOWN';
    return (
      <Tag
        severity={STATUS_SEVERITY[status]}
        value={STATUS_LABELS[status] || status}
      />
    );
  };

  const dateTemplate = (rowData: IOrder) => {
    if (!rowData.createdAt) return '-';
    return new Date(rowData.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const totalTemplate = (rowData: IOrder) => {
    return rowData.total
      ? `R$ ${rowData.total.toFixed(2).replace('.', ',')}`
      : '-';
  };

  const actionsTemplate = (rowData: IOrder) => (
    <Button
      icon="pi pi-eye"
      className="p-button-rounded p-button-text p-button-info"
      tooltip="Ver detalhes"
      tooltipOptions={{ position: 'top' }}
      onClick={() => navigate(`/admin/orders/${rowData.id}`)}
    />
  );

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesSearch = globalFilter
      ? String(order.id).includes(globalFilter) ||
        (order.paymentMethod || '').toLowerCase().includes(globalFilter.toLowerCase())
      : true;
    const matchesDate = dateFilter
      ? order.createdAt &&
        new Date(order.createdAt).toDateString() === dateFilter.toDateString()
      : true;
    return matchesStatus && matchesSearch && matchesDate;
  });

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <span className="text-xl font-bold text-900">Pedidos</span>
      <div className="flex flex-wrap gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-auto"
          />
        </span>
        <Dropdown
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(e) => setStatusFilter(e.value)}
          placeholder="Filtrar status"
          className="w-full md:w-auto"
        />
        <Calendar
          value={dateFilter}
          onChange={(e) => setDateFilter(e.value as Date | null)}
          placeholder="Filtrar data"
          dateFormat="dd/mm/yy"
          showClear
          className="w-full md:w-auto"
        />
        <Button
          icon="pi pi-refresh"
          className="p-button-outlined"
          tooltip="Atualizar"
          onClick={fetchOrders}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      <div className="surface-card border-round shadow-2 p-4">
        <DataTable
          value={filteredOrders}
          header={header}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="Nenhum pedido encontrado."
          stripedRows
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <Column field="id" header="# Pedido" sortable style={{ width: '8rem' }} />
          <Column header="Data" body={dateTemplate} sortable sortField="createdAt" />
          <Column field="paymentMethod" header="Pagamento" />
          <Column field="shippingOption" header="Frete" />
          <Column header="Total" body={totalTemplate} sortable sortField="total" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" />
          <Column header="Ações" body={actionsTemplate} style={{ width: '6rem', textAlign: 'center' }} />
        </DataTable>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  { label: 'Todos', value: null },
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

const STATUS_SEVERITY: Record<string, 'warning' | 'success' | 'info' | 'danger' | 'help' | 'secondary' | undefined> = {
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'success',
  EM_PREPARACAO: 'help',
  EM_TRANSPORTE: 'info',
  CONCLUIDO: 'success',
  CANCELADO: 'danger',
};

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState<(Date | null)[]>([null, null]);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get('status') || null);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const s = searchParams.get('status');
    // Evita injetar "[object Object]" ou valores inválidos no estado
    if (s && s !== '[object Object]') {
      setStatusFilter(s);
    } else {
      setStatusFilter(null);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    const response = await OrderService.getAllOrders();
    if (response.success) {
      const raw = response.data;
      setOrders(Array.isArray(raw) ? raw : raw?.content ?? []);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar pedidos', life: 3000 });
    }
    setLoading(false);
  };

  const handleStatusFilterChange = (value: string | null) => {
    // Se o valor for nulo ou não for uma string válida, limpa o filtro
    if (!value || typeof value !== 'string') {
      setStatusFilter(null);
      setSearchParams({});
    } else {
      setStatusFilter(value);
      setSearchParams({ status: value });
    }
  };
  const statusTemplate = (rowData: IOrder) => {
    const status = rowData.status || 'UNKNOWN';
    return <Tag severity={STATUS_SEVERITY[status]} value={STATUS_LABELS[status] || status} />;
  };

  const dateTemplate = (rowData: IOrder) => {
    if (!rowData.orderDate) return '-';
    return new Date(rowData.orderDate).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const totalTemplate = (rowData: IOrder) =>
    rowData.total ? `R$ ${rowData.total.toFixed(2).replace('.', ',')}` : '-';

  const actionsTemplate = (rowData: IOrder) => (
    <Button
      icon="pi pi-eye"
      className="p-button-rounded p-button-text p-button-info"
      tooltip="Ver detalhes"
      tooltipOptions={{ position: 'top' }}
      onClick={() => navigate(`/admin/orders/${rowData.id}`)}
    />
  );

  const [rangeStart, rangeEnd] = dateRange;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;

    const matchesSearch = globalFilter
      ? String(order.id).includes(globalFilter) ||
      (order.user?.displayName || '').toLowerCase().includes(globalFilter.toLowerCase()) ||
      (order.user?.username || '').toLowerCase().includes(globalFilter.toLowerCase())
      : true;

    const orderDate = order.orderDate ? new Date(order.orderDate) : null;
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const matchesDate =
      rangeStart && rangeEnd
        ? orderDate !== null &&
        orderDate >= startOfDay(rangeStart) &&
        orderDate <= new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate(), 23, 59, 59)
        : rangeStart
          ? orderDate !== null && orderDate >= startOfDay(rangeStart)
          : true;

    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleDateRangeChange = (value: Date | Date[] | null) => {
    if (!value) {
      setDateRange([null, null]);
    } else if (Array.isArray(value)) {
      setDateRange([value[0] ?? null, value[1] ?? null]);
    } else {
      setDateRange([value, null]);
    }
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <span className="text-xl font-bold text-900">Pedidos</span>
      <div className="flex flex-wrap gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" style={{ left: '0.75rem' }} />
          <InputText
            placeholder="Buscar por ID ou comprador..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </span>
        <Dropdown
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(e) => handleStatusFilterChange(e.value)}
          placeholder="Filtrar status"
        />
        <div className="flex align-items-center gap-2">
          <Calendar
            value={dateRange.filter(Boolean) as Date[]}
            onChange={(e) => handleDateRangeChange(e.value as Date | Date[] | null)}
            selectionMode="range"
            placeholder="Filtrar por período"
            dateFormat="dd/mm/yy"
            showClear
            readOnlyInput
          />
          {(dateRange[0] || dateRange[1]) && (
            <Button
              icon="pi pi-filter-slash"
              className="p-button-flat p-button-plain"
              tooltip="Limpar período"
              tooltipOptions={{ position: 'top' }}
              onClick={() => setDateRange([null, null])}
            />
          )}
        </div>
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
      <div className="surface-card border-round p-4">
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
          <Column header="Data" body={dateTemplate} sortable sortField="orderDate" />
          <Column header="Comprador" body={(rowData: IOrder) => rowData.user?.displayName || rowData.user?.username || '-'} sortable sortField="user.displayName" />
          <Column header="Frete" body={(rowData: IOrder) => {
            const v = (rowData as any).shippingType;
            if (!v) return '-';
            return v === 'EXPRESSO' ? 'Expresso' : 'Normal';
          }} />
          <Column header="Total" body={totalTemplate} sortable sortField="total" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" />
          <Column header="Ações" body={actionsTemplate} style={{ width: '6rem', textAlign: 'center' }} />
        </DataTable>
      </div>
    </div>
  );
};

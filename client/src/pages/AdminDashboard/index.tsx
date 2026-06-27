import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import OrderService from '../../services/orderService';
import type { IOrder } from '../../commons/types';
import { AdminPageHeader } from '@/components/AdminNavbar';

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

const STATUS_COLORS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#f59e0b',
  PAGO: '#22c55e',
  EM_PREPARACAO: '#8b5cf6',
  EM_TRANSPORTE: '#3b82f6',
  CONCLUIDO: '#10b981',
  CANCELADO: '#ef4444',
};

const KPI_CARD_CONFIGS = [
  {
    key: 'total',
    label: 'Total de Pedidos',
    icon: 'pi-shopping-cart',
    color: '#3b82f6',
    bg: '#dbeafe',
  },
  {
    key: 'revenue',
    label: 'Receita Total',
    icon: 'pi-dollar',
    color: '#22c55e',
    bg: '#dcfce7',
  },
  {
    key: 'pending',
    label: 'Aguardando Pagamento',
    icon: 'pi-clock',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    key: 'shipping',
    label: 'Em Transporte',
    icon: 'pi-truck',
    color: '#06b6d4',
    bg: '#cffafe',
  },
];

function formatCurrency(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function getLast7DaysLabels(): string[] {
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
  }
  return labels;
}

function getLast6MonthsLabels(): string[] {
  const labels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    labels.push(d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));
  }
  return labels;
}

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

  const kpis = useMemo(() => {
    const total = orders.length;
    const revenue = orders
      .filter((o) => o.status === 'PAGO' || o.status === 'CONCLUIDO')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter((o) => o.status === 'AGUARDANDO_PAGAMENTO').length;
    const shipping = orders.filter((o) => o.status === 'EM_TRANSPORTE').length;
    return { total, revenue, pending, shipping };
  }, [orders]);

  const kpiValues: Record<string, React.ReactNode> = {
    total: kpis.total,
    revenue: formatCurrency(kpis.revenue),
    pending: kpis.pending,
    shipping: kpis.shipping,
  };

  const statusCount = useMemo(
    () =>
      orders.reduce((acc, o) => {
        const s = o.status || 'UNKNOWN';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    [orders]
  );

  const donutData = useMemo(() => {
    const statuses = Object.keys(STATUS_LABELS);
    return {
      labels: statuses.map((s) => STATUS_LABELS[s]),
      datasets: [
        {
          data: statuses.map((s) => statusCount[s] || 0),
          backgroundColor: statuses.map((s) => STATUS_COLORS[s]),
          hoverBackgroundColor: statuses.map((s) => STATUS_COLORS[s]),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [statusCount]);

  const donutOptions = {
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 16, font: { size: 12 } } },
    },
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const statuses = Object.keys(STATUS_LABELS);
        const status = statuses[index];
        if (status) {
          navigate(`/admin/orders?status=${status}`);
        }
      }
    },
    onHover: (event: any, elements: any[]) => {
      if (event.native && event.native.target) {
        event.native.target.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
      }
    }
  };

  const lineData = useMemo(() => {
    const labels = getLast7DaysLabels();
    const counts = labels.map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return orders.filter((o) => {
        if (!o.orderDate) return false;
        return new Date(o.orderDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) === dateStr;
      }).length;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Pedidos',
          data: counts,
          fill: true,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
        },
      ],
    };
  }, [orders]);

  const lineOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const barData = useMemo(() => {
    const labels = getLast6MonthsLabels();
    const revenues = labels.map((_, idx) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - idx));
      return orders
        .filter((o) => {
          if (!o.orderDate) return false;
          const od = new Date(o.orderDate);
          return (
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear() &&
            (o.status === 'PAGO' || o.status === 'CONCLUIDO')
          );
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Receita',
          data: revenues,
          backgroundColor: 'rgba(34,197,94,0.75)',
          borderColor: '#22c55e',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [orders]);

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 12 },
          callback: (v: any) => `R$ ${Number(v).toFixed(0)}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime())
        .slice(0, 5),
    [orders]
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
      <AdminPageHeader title="Dashboard" subtitle="Visão geral da operação" />

      <style>{`
        .dash-grid-kpi {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .dash-grid-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .dash-grid-bottom {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1rem;
        }
        @media (max-width: 992px) {
          .dash-grid-charts {
            grid-template-columns: 1fr;
          }
          .dash-grid-bottom {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dash-grid-kpi">
        {KPI_CARD_CONFIGS.map(({ key, label, icon, color, bg }) => (
          <div
            key={key}
            className="surface-card shadow-1 border-round-lg p-3 w-full"
            style={{ borderTop: `3px solid ${color}` }}
          >
            <div className="flex align-items-center justify-content-between">
              <div>
                <span className="block text-500 font-medium text-sm mb-2">{label}</span>
                <span className="block font-bold text-2xl" style={{ color }}>{kpiValues[key]}</span>
              </div>
              <div
                className="w-3rem h-3rem border-round-lg flex align-items-center justify-content-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <i className={`pi ${icon} text-lg`} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid-charts">
        <div className="surface-card shadow-1 border-round-lg p-4 w-full">
          <h3 className="m-0 mb-3 text-800 font-semibold text-sm">Pedidos — últimos 7 dias</h3>
          <div style={{ height: '220px' }}>
            <Chart type="line" data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="surface-card shadow-1 border-round-lg p-4 w-full">
          <h3 className="m-0 mb-3 text-800 font-semibold text-sm">Receita — últimos 6 meses</h3>
          <div style={{ height: '220px' }}>
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="dash-grid-bottom">
        <div className="surface-card shadow-1 border-round-lg p-4 w-full overflow-hidden">
          <div className="flex align-items-center justify-content-between mb-3">
            <h3 className="m-0 text-800 font-semibold text-sm">Pedidos Recentes</h3>
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
            responsiveLayout="scroll"
          >
            <Column field="id" header="# Pedido" style={{ minWidth: '7rem' }} />
            <Column
              header="Data"
              style={{ minWidth: '8rem' }}
              body={(row: IOrder) =>
                row.orderDate
                  ? new Date(row.orderDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : '-'
              }
            />
            <Column
              header="Pagamento"
              style={{ minWidth: '8rem' }}
              body={(row: IOrder) => {
                const map: Record<string, string> = {
                  CARTAO_CREDITO: 'Cartão de Crédito',
                  PIX: 'Pix',
                  BOLETO: 'Boleto Bancário',
                };
                return map[(row as any).paymentMethod] || (row as any).paymentMethod || '-';
              }}
            />
            <Column
              header="Total"
              style={{ minWidth: '8rem' }}
              body={(row: IOrder) => (row.total ? formatCurrency(row.total) : '-')}
            />
            <Column
              header="Status"
              style={{ minWidth: '10rem' }}
              body={(row: IOrder) => (
                <Tag
                  severity={STATUS_SEVERITY[row.status || '']}
                  value={STATUS_LABELS[row.status || ''] || row.status}
                />
              )}
            />
            <Column
              header=""
              style={{ minWidth: '3.5rem', textAlign: 'center' }}
              body={(row: IOrder) => (
                <Button
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() => navigate(`/admin/orders/${row.id}`)}
                />
              )}
            />
          </DataTable>
        </div>

        <div className="surface-card shadow-1 border-round-lg p-4 w-full">
          <h3 className="m-0 mb-3 text-800 font-semibold text-sm">Distribuição de Status</h3>
          <div style={{ height: '260px' }}>
            <Chart type="doughnut" data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
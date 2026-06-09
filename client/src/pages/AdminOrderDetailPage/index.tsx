import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Timeline } from 'primereact/timeline';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';
import OrderService from '../../services/orderService';
import type { IOrder, IAttachment, IOrderStatusHistory } from '../../commons/types';

const STATUS_OPTIONS = [
  { label: 'Aguardando Pagamento', value: 'AGUARDANDO_PAGAMENTO' },
  { label: 'Pago', value: 'PAGO' },
  { label: 'Em Preparação', value: 'EM_PREPARACAO' },
  { label: 'Em Transporte', value: 'EM_TRANSPORTE' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

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

export const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<any>(null);

  const [order, setOrder] = useState<IOrder | null>(null);
  const [attachments, setAttachments] = useState<IAttachment[]>([]);
  const [history, setHistory] = useState<IOrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [observation, setObservation] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachDescription, setAttachDescription] = useState('');

  useEffect(() => {
    if (id) fetchOrderData(Number(id));
  }, [id]);

  const fetchOrderData = async (orderId: number) => {
    setLoading(true);
    const [orderRes, attachRes, historyRes] = await Promise.all([
      OrderService.getOrderById(orderId),
      OrderService.getAttachments(orderId),
      OrderService.getOrderHistory(orderId),
    ]);
    if (orderRes.success) {
      setOrder(orderRes.data);
      setSelectedStatus(orderRes.data.status || '');
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar pedido', life: 3000 });
    }
    if (attachRes.success) setAttachments(attachRes.data || []);
    if (historyRes.success) setHistory(historyRes.data || []);
    setLoading(false);
  };

  const handleStatusUpdate = () => {
    if (!selectedStatus || selectedStatus === order?.status) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um status diferente', life: 3000 });
      return;
    }
    confirmDialog({
      message: `Alterar status para "${STATUS_LABELS[selectedStatus]}"?`,
      header: 'Confirmar Alteração',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        setUpdatingStatus(true);
        const response = await OrderService.updateOrderStatus(Number(id), selectedStatus, observation || undefined);
        if (response.success) {
          toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Status atualizado! E-mail enviado ao cliente.', life: 4000 });
          setObservation('');
          fetchOrderData(Number(id));
        } else {
          toast.current?.show({ severity: 'error', summary: 'Erro', detail: response.message || 'Falha ao atualizar status', life: 3000 });
        }
        setUpdatingStatus(false);
      },
    });
  };

  const handleFileUpload = async (event: { files: File[] }) => {
    const file = event.files[0];
    if (!file || !id) return;
    setUploadingFile(true);
    const response = await OrderService.uploadAttachment(Number(id), file, attachDescription || undefined);
    if (response.success) {
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Arquivo enviado com sucesso!', life: 3000 });
      setAttachDescription('');
      fileUploadRef.current?.clear();
      fetchOrderData(Number(id));
    } else {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: response.message || 'Falha ao enviar arquivo', life: 3000 });
    }
    setUploadingFile(false);
  };

  const handleDownload = (attachment: IAttachment) => {
    if (!attachment.id || !id) return;
    OrderService.downloadAttachment(Number(id), attachment.id, attachment.originalFileName);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIconTemplate = (rowData: IAttachment) => (
    <i
      className={`pi ${rowData.contentType?.includes('pdf') ? 'pi-file-pdf text-red-500' : 'pi-image text-blue-500'}`}
      style={{ fontSize: '1.4rem' }}
    />
  );

  const fileActionsTemplate = (rowData: IAttachment) => (
    <Button
      icon="pi pi-download"
      className="p-button-rounded p-button-text p-button-sm"
      tooltip="Baixar arquivo"
      tooltipOptions={{ position: 'top' }}
      onClick={() => handleDownload(rowData)}
    />
  );

  const timelineEvents = history.map((h) => ({
    label: `${STATUS_LABELS[h.previousStatus || ''] || h.previousStatus || 'Início'} → ${STATUS_LABELS[h.newStatus] || h.newStatus}`,
    date: formatDate(h.changedAt),
    by: h.changedBy || 'sistema',
    obs: h.observation,
    color: h.newStatus === 'CANCELADO' ? '#ef4444' : h.newStatus === 'CONCLUIDO' ? '#22c55e' : '#3b82f6',
  }));

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-5">
        <p className="text-600">Pedido não encontrado.</p>
        <Button label="Voltar" icon="pi pi-arrow-left" onClick={() => navigate('/admin/orders')} className="mt-3" />
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Page header */}
      <div className="flex align-items-center justify-content-between mb-4">
        <div className="flex align-items-center gap-3">
          <Button icon="pi pi-arrow-left" className="p-button-text p-button-rounded" onClick={() => navigate('/admin/dashboard')} />
          <div>
            <h2 className="m-0 text-900 font-bold text-2xl">Pedido #{order.id}</h2>
            <span className="text-500 text-sm">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <Tag
          severity={STATUS_SEVERITY[order.status || '']}
          value={STATUS_LABELS[order.status || ''] || order.status}
          style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
        />
      </div>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div>
          {/* Order info */}
          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Informações do Pedido</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="mb-3">
              <div>
                <p className="text-500 text-sm mb-1">Pagamento</p>
                <p className="font-medium text-900 m-0">{order.paymentMethod || '-'}</p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">Frete</p>
                <p className="font-medium text-900 m-0">{order.shippingOption || '-'}</p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">Total</p>
                <p className="font-medium text-900 m-0">
                  {order.total ? `R$ ${order.total.toFixed(2).replace('.', ',')}` : '-'}
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <>
                <Divider />
                <h4 className="mb-2 text-700">Itens do Pedido</h4>
                <DataTable value={order.items} className="p-datatable-sm" stripedRows>
                  <Column field="product.id" header="Produto ID" />
                  <Column field="quantity" header="Qtd" />
                  <Column header="Preço Unit." body={(item: any) => item.price ? `R$ ${item.price.toFixed(2).replace('.', ',')}` : '-'} />
                  <Column header="Subtotal" body={(item: any) => item.price && item.quantity ? `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}` : '-'} />
                </DataTable>
              </>
            )}
          </div>

          {/* Attachments */}
          <div className="surface-card shadow-2 border-round p-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Anexos</h3>
            <div className="mb-3">
              <label className="block text-700 text-sm mb-1">Descrição do arquivo (opcional)</label>
              <InputTextarea
                value={attachDescription}
                onChange={(e) => setAttachDescription(e.target.value)}
                rows={2}
                placeholder="Ex: Nota fiscal, comprovante de pagamento..."
                className="w-full"
              />
            </div>
            <FileUpload
              ref={fileUploadRef}
              mode="basic"
              name="files"
              accept=".pdf,.png,.jpg,.jpeg"
              maxFileSize={10_000_000}
              customUpload
              uploadHandler={handleFileUpload}
              chooseLabel="Selecionar arquivo"
              uploadLabel="Enviar"
              className="mb-4"
              auto={false}
              disabled={uploadingFile}
            />
            {attachments.length > 0 ? (
              <DataTable value={attachments} className="p-datatable-sm" stripedRows emptyMessage="Nenhum anexo.">
                <Column header="" body={fileIconTemplate} style={{ width: '3rem' }} />
                <Column field="originalFileName" header="Arquivo" />
                <Column field="contentType" header="Tipo" />
                <Column header="Tamanho" body={(row: IAttachment) => formatSize(row.fileSize)} />
                <Column header="Enviado em" body={(row: IAttachment) => formatDate(row.uploadedAt)} />
                <Column field="uploadedBy" header="Por" />
                <Column field="description" header="Descrição" />
                <Column header="" body={fileActionsTemplate} style={{ width: '4rem' }} />
              </DataTable>
            ) : (
              <p className="text-500 text-center mt-3">Nenhum anexo encontrado para este pedido.</p>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div>
          {/* Status update */}
          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Alterar Status</h3>
            <Dropdown
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => setSelectedStatus(e.value)}
              placeholder="Selecionar status"
              className="w-full mb-3"
            />
            <label className="block text-700 text-sm mb-1">Observação (opcional)</label>
            <InputTextarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
              placeholder="Motivo da alteração..."
              className="w-full mb-3"
            />
            <Button
              label="Atualizar Status"
              icon="pi pi-check"
              className="w-full"
              loading={updatingStatus}
              disabled={!selectedStatus || selectedStatus === order.status}
              onClick={handleStatusUpdate}
            />
            <p className="text-500 text-sm mt-2 mb-0 text-center">
              <i className="pi pi-envelope mr-1" />
              Um e-mail será enviado ao cliente.
            </p>
          </div>

          {/* History */}
          <div className="surface-card shadow-2 border-round p-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">
              Histórico de Status
              {history.length > 0 && (
                <span className="ml-2 text-500 text-sm font-normal">({history.length} alterações)</span>
              )}
            </h3>
            {timelineEvents.length > 0 ? (
              <Timeline
                value={timelineEvents}
                content={(item) => (
                  <div className="mb-3">
                    <p className="font-semibold text-900 m-0 text-sm">{item.label}</p>
                    <small className="text-500 block">{item.date}</small>
                    <small className="text-400 block">por {item.by}</small>
                    {item.obs && <small className="text-600 block mt-1 font-italic">"{item.obs}"</small>}
                  </div>
                )}
                marker={(item) => (
                  <span
                    className="flex w-2rem h-2rem align-items-center justify-content-center border-circle flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <i className="pi pi-check text-white text-xs" />
                  </span>
                )}
              />
            ) : (
              <p className="text-500 text-sm text-center">Nenhuma alteração registrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

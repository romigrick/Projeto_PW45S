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
import { Message } from 'primereact/message';
import OrderService from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import type { IOrder, IAttachment, IOrderStatusHistory } from '../../commons/types';

const STATUS_OPTIONS = [
  { label: 'Aguardando Pagamento', value: 'AGUARDANDO_PAGAMENTO' },
  { label: 'Pago', value: 'PAGO' },
  { label: 'Em Preparação', value: 'EM_PREPARACAO' },
  { label: 'Em Transporte', value: 'EM_TRANSPORTE' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

const STATUS_SEVERITY: Record<string, 'warning' | 'success' | 'info' | 'danger' | 'help' | undefined> = {
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'success',
  EM_PREPARACAO: 'help',
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

export const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<any>(null);
  const transportFileRef = useRef<any>(null);
  const { isAdmin, isOperator } = useAuth();
  const canManage = isAdmin || isOperator;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [attachments, setAttachments] = useState<IAttachment[]>([]);
  const [history, setHistory] = useState<IOrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [observation, setObservation] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachDescription, setAttachDescription] = useState('');
  const [transportFile, setTransportFile] = useState<File | null>(null);
  const [hasFile, setHasFile] = useState(false);

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
    if (selectedStatus === 'EM_TRANSPORTE' && !transportFile) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Anexe a nota fiscal antes de enviar para transporte.', life: 4000 });
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

        // Passa o arquivo direto para updateOrderStatus — backend faz tudo em um único email
        const response = await OrderService.updateOrderStatus(
          Number(id),
          selectedStatus,
          observation || undefined,
          selectedStatus === 'EM_TRANSPORTE' ? transportFile : null
        );

        if (response.success) {
          toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Status atualizado! E-mail enviado ao cliente.', life: 4000 });
          setObservation('');
          setTransportFile(null);
          transportFileRef.current?.clear();
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
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIconTemplate = (rowData: IAttachment) => (
    <i className={`pi ${rowData.contentType?.includes('pdf') ? 'pi-file-pdf text-red-500' : 'pi-image text-blue-500'}`} style={{ fontSize: '1.4rem' }} />
  );

  const fileActionsTemplate = (rowData: IAttachment) => (
    <Button icon="pi pi-download" className="p-button-rounded p-button-text p-button-sm" tooltip="Baixar arquivo" tooltipOptions={{ position: 'top' }} onClick={() => handleDownload(rowData)} />
  );

  const timelineEvents = [...history].reverse().map((h) => ({
    label: `${STATUS_LABELS[h.previousStatus || ''] || h.previousStatus || 'Início'} → ${STATUS_LABELS[h.newStatus] || h.newStatus}`,
    date: formatDate(h.changedAt),
    by: h.changedBy || 'sistema',
    obs: h.observation,
    color: STATUS_COLORS[h.newStatus] || '#3b82f6',
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

  const addr = (order as any).address;
  const customer = (order as any).customer || (order as any).user;

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex align-items-center justify-content-between mb-4">
        <div className="flex align-items-center gap-3">
          <Button icon="pi pi-arrow-left" className="p-button-text p-button-rounded" onClick={() => navigate('/admin/orders')} />
          <div>
            <h2 className="m-0 text-900 font-bold text-2xl">Pedido #{order.id}</h2>
            <span className="text-500 text-sm">{formatDate((order as any).orderDate)}</span>
          </div>
        </div>
        <Tag
          severity={STATUS_SEVERITY[order.status || '']}
          value={STATUS_LABELS[order.status || ''] || order.status}
          style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        <div>
          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Dados do Cliente</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p className="text-500 text-sm mb-1">Nome</p>
                <p className="font-medium text-900 m-0">{customer?.displayName || customer?.name || '-'}</p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">E-mail</p>
                <p className="font-medium text-900 m-0">{customer?.email || customer?.username || '-'}</p>
              </div>
            </div>

            {addr && (
              <>
                <Divider />
                <h4 className="mt-0 mb-2 text-700">Endereço de Entrega</h4>
                <p className="m-0 text-900">
                  {[addr.street, addr.number && `nº ${addr.number}`, addr.neighborhood, addr.complement].filter(Boolean).join(', ')}
                </p>
                <p className="m-0 text-900">{[addr.city, addr.state].filter(Boolean).join(' - ')}</p>
                {addr.zipCode && <p className="m-0 text-500 text-sm mt-1">CEP: {addr.zipCode}</p>}
              </>
            )}
          </div>

          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Informações do Pedido</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="mb-3">
              <div>
                <p className="text-500 text-sm mb-1">Pagamento</p>
                <p className="font-medium text-900 m-0">
                  {{ CARTAO_CREDITO: 'Cartão de Crédito', PIX: 'Pix', BOLETO: 'Boleto Bancário' }[(order as any).paymentMethod] || (order as any).paymentMethod || '-'}
                </p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">Frete</p>
                <p className="font-medium text-900 m-0">
                  {(order as any).shippingType === 'EXPRESSO' ? 'Expresso' : (order as any).shippingType === 'NORMAL' ? 'Normal' : (order as any).shippingType || '-'}
                  {' '}
                  ({`R$ ${Number((order as any).shippingCost || 0).toFixed(2).replace('.', ',')}`})
                </p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">Subtotal</p>
                <p className="font-medium text-900 m-0">
                  {order.total != null ? `R$ ${Number(order.total).toFixed(2).replace('.', ',')}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-500 text-sm mb-1">Total</p>
                <p className="font-bold text-900 m-0">
                  {order.total != null
                    ? `R$ ${(Number(order.total) + Number((order as any).shippingCost || 0)).toFixed(2).replace('.', ',')}`
                    : '-'}
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <>
                <Divider />
                <h4 className="mb-2 text-700">Itens do Pedido</h4>
                <DataTable value={order.items} className="p-datatable-sm" stripedRows>
                  <Column field="product.id" header="Produto ID" />
                  <Column body={(item: any) => item.product?.name || item.product?.id || '-'} header="Produto" />
                  <Column field="quantity" header="Qtd" />
                  <Column header="Preço Unit." body={(item: any) => item.price ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}` : '-'} />
                  <Column header="Subtotal" body={(item: any) => item.price && item.quantity ? `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}` : '-'} />
                </DataTable>
              </>
            )}
          </div>

          {/* Attachments — upload visível para admin e operador */}
          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">Anexos</h3>

            {attachments.length > 0 ? (
              <DataTable value={attachments} className="p-datatable-sm" stripedRows>
                <Column header="" body={fileIconTemplate} style={{ width: '3rem' }} />
                <Column field="originalFileName" header="Arquivo" />
                <Column field="description" header="Descrição" />
                <Column header="Tamanho" body={(row: IAttachment) => formatSize(row.fileSize)} />
                <Column header="Enviado em" body={(row: IAttachment) => formatDate(row.uploadedAt)} />
                <Column header="" body={fileActionsTemplate} style={{ width: '4rem' }} />
              </DataTable>
            ) : (
              <p className="text-500 text-sm">Nenhum anexo.</p>
            )}

            {canManage && (
              <div className="flex align-items-center gap-2 mt-3">
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  name="files"
                  accept=".pdf,.png,.jpg,.jpeg"
                  maxFileSize={10_000_000}
                  customUpload
                  uploadHandler={handleFileUpload}
                  chooseLabel="Selecionar arquivo"
                  auto={false}
                  disabled={uploadingFile}
                  onSelect={() => setHasFile(true)}
                />
                {hasFile && (
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger p-button-text"
                    tooltip="Remover seleção"
                    disabled={uploadingFile}
                    onClick={() => {
                      fileUploadRef.current?.clear();
                      setHasFile(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Coluna direita */}
        <div>
          <div className="surface-card shadow-2 border-round p-4 mb-4">
            <h3 className="mt-0 mb-3 text-800 font-semibold">
              {canManage ? 'Alterar Status' : 'Status do Pedido'}
            </h3>

            {canManage ? (
              <>
                <Dropdown
                  value={selectedStatus}
                  options={STATUS_OPTIONS}
                  onChange={(e) => setSelectedStatus(e.value)}
                  placeholder="Selecionar status"
                  className="w-full mb-3"
                />

                {selectedStatus === 'EM_TRANSPORTE' && (
                  <div className="mb-3 p-3 border-round border-1 border-blue-200" style={{ backgroundColor: '#eff6ff' }}>
                    <label className="block text-700 text-sm font-medium mb-2">
                      <i className="pi pi-file-pdf mr-1 text-blue-600" />
                      Nota Fiscal <span className="text-red-500">*</span>
                    </label>
                    <p className="text-500 text-xs mt-0 mb-2">Obrigatório para enviar ao transporte.</p>
                    <FileUpload
                      ref={transportFileRef}
                      mode="basic"
                      name="notaFiscal"
                      accept=".pdf"
                      maxFileSize={10_000_000}
                      customUpload
                      uploadHandler={() => { }}
                      chooseLabel={transportFile ? `✓ ${transportFile.name}` : 'Selecionar PDF'}
                      auto={false}
                      onSelect={(e) => setTransportFile(e.files[0])}
                      onClear={() => setTransportFile(null)}
                      className="w-full"
                    />
                  </div>
                )}

                <label className="block text-700 text-sm mb-1">Observação (opcional)</label>
                <InputTextarea value={observation} onChange={(e) => setObservation(e.target.value)} rows={3} placeholder="Motivo da alteração..." className="w-full mb-3" />
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
              </>
            ) : (
              <Message
                severity="info"
                className="w-full"
                text="Você tem acesso somente de visualização. Apenas administradores e operadores podem alterar o status."
              />
            )}
          </div>

          <div className="surface-card shadow-2 border-round p-4">
            <style>{`
              .timeline-no-opposite .p-timeline-event-opposite {
                display: none !important;
              }
            `}</style>
            <h3 className="mt-0 mb-3 text-800 font-semibold">
              Histórico de Status
              {history.length > 0 && <span className="ml-2 text-500 text-sm font-normal">({history.length})</span>}
            </h3>
            {timelineEvents.length > 0 ? (
              <Timeline
                value={timelineEvents}
                align="left"
                className="w-full timeline-no-opposite"
                marker={(item) => (
                  <span
                    className="flex w-2rem h-2rem align-items-center justify-content-center border-circle flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <i className="pi pi-check text-white text-xs" />
                  </span>
                )}
                content={(item) => (
                  <div className="ml-2 mb-3">
                    <p className="font-semibold text-900 m-0 text-sm">{item.label}</p>
                    <small className="text-500 block">{item.date}</small>
                    <small className="text-400 block">por {item.by}</small>
                    {item.obs && <small className="text-600 block mt-1 font-italic">"{item.obs}"</small>}
                  </div>
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
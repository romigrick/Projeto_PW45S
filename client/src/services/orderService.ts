import type { IOrder, IResponse } from '@/commons/types';
import { api } from '@/lib/axios';

const orderURL = '/orders';

const createOrder = async (order: IOrder): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${orderURL}/finalize`, order);
    response = { status: 201, success: true, message: 'Pedido criado com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao criar pedido', data: err.response?.data || err.message };
  }
  return response;
};

const getUserOrders = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/user`);
    response = { status: 200, success: true, message: 'Pedidos carregados com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao carregar pedidos', data: err.response?.data || err.message };
  }
  return response;
};

const getOrderById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/${id}`);
    response = { status: 200, success: true, message: 'Pedido carregado com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao carregar pedido', data: err.response?.data || err.message };
  }
  return response;
};

const getAllOrders = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(orderURL);
    response = { status: 200, success: true, message: 'Pedidos carregados com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao carregar pedidos', data: err.response?.data || err.message };
  }
  return response;
};

// Backend: POST /orders/{id}/status?status=X&observation=Y [+ file opcional via multipart]
const updateOrderStatus = async (
  id: number,
  status: string,
  observation?: string,
  file?: File | null
): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const params = new URLSearchParams({ status });
    if (observation) params.append('observation', observation);

    let data;
    if (file) {
      // Envia como multipart para o backend anexar o arquivo ao email
      const formData = new FormData();
      formData.append('file', file);
      data = await api.post(`${orderURL}/${id}/status?${params.toString()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      data = await api.post(`${orderURL}/${id}/status?${params.toString()}`);
    }

    response = { status: 200, success: true, message: 'Status atualizado com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao atualizar status', data: err.response?.data || err.message };
  }
  return response;
};

// Backend expects field name "files" (MultipartFile[])
const uploadAttachment = async (id: number, file: File, description?: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const formData = new FormData();
    formData.append('files', file);
    if (description) formData.append('description', description);
    const data = await api.post(`${orderURL}/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    response = { status: 200, success: true, message: 'Anexo enviado com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao enviar anexo', data: err.response?.data || err.message };
  }
  return response;
};

const getAttachments = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/${id}/attachments`);
    response = { status: 200, success: true, message: 'Anexos carregados com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao carregar anexos', data: err.response?.data || err.message };
  }
  return response;
};

// Backend: GET /orders/{id}/history
const getOrderHistory = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/${id}/history`);
    response = { status: 200, success: true, message: 'Histórico carregado com sucesso!', data: data.data };
  } catch (err: any) {
    response = { status: err.response?.status || 500, success: false, message: 'Falha ao carregar histórico', data: err.response?.data || err.message };
  }
  return response;
};

// Backend: GET /orders/{id}/attachments/{attachmentId}/download — returns a file blob
const downloadAttachment = async (orderId: number, attachmentId: number, fileName: string): Promise<void> => {
  try {
    const response = await api.get(
      `${orderURL}/${orderId}/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Erro ao baixar arquivo', err);
  }
};

const OrderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  uploadAttachment,
  getAttachments,
  getOrderHistory,
  downloadAttachment,
};

export default OrderService;

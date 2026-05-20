import type { IOrder, IOrderResponse, IResponse } from '../commons/types';
import { api } from '../lib/axios';

// URL base para as requisições de pedidos
const orderURL = "/orders";

/**
 * Função para criar um novo pedido
 * @param order - Dados do pedido que será criado
 * @returns - Retorna uma Promise com a resposta da API
 **/
const createOrder = async (order: IOrder): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${orderURL}/finalize`, order);
    response = {
      status: 201,
      success: true,
      message: "Pedido criado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao criar pedido",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar pedidos do usuário
 * @returns - Retorna uma Promise com a resposta da API
 **/
const getUserOrders = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/user`);
    response = {
      status: 200,
      success: true,
      message: "Pedidos carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar pedidos",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar um pedido pelo id
 * @param id - ID do pedido
 * @returns - Retorna uma Promise com a resposta da API
 **/
const getOrderById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${orderURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Pedido carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar pedido",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

// Objeto que exporta todas as funções
const OrderService = {
  createOrder,
  getUserOrders,
  getOrderById,
};

export default OrderService;

import type { IAddress, IResponse } from '../commons/types';
import { api } from '../lib/axios';

// URL base para as requisições de endereços
const addressURL = "/addresses";

/**
 * Função para criar um novo endereço
 * @param address - Dados do endereço que será criado
 * @returns - Retorna uma Promise com a resposta da API
 **/
const createAddress = async (address: Omit<IAddress, 'id'>): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(addressURL, address);
    response = {
      status: 201,
      success: true,
      message: "Endereço criado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao criar endereço",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar endereços do usuário
 * @returns - Retorna uma Promise com a resposta da API
 **/
const getUserAddresses = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${addressURL}/user`);
    response = {
      status: 200,
      success: true,
      message: "Endereços carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar endereços",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar um endereço pelo id
 * @param id - ID do endereço
 * @returns - Retorna uma Promise com a resposta da API
 **/
const getAddressById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Endereço carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar endereço",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para atualizar um endereço
 * @param id - ID do endereço
 * @param address - Dados atualizados do endereço
 * @returns - Retorna uma Promise com a resposta da API
 **/
const updateAddress = async (id: number, address: Omit<IAddress, 'id'>): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.put(`${addressURL}/${id}`, address);
    response = {
      status: 200,
      success: true,
      message: "Endereço atualizado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao atualizar endereço",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para deletar um endereço
 * @param id - ID do endereço
 * @returns - Retorna uma Promise com a resposta da API
 **/
const deleteAddress = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    await api.delete(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Endereço deletado com sucesso!",
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao deletar endereço",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

// Objeto que exporta todas as funções
const AddressService = {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};

export default AddressService;

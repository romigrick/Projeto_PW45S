import type { IResponse } from '@/commons/types';
import { api } from '@/lib/axios';

const userURL = '/users';

const getAllUsers = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    // Backend retorna Page<UserDTO> — buscamos sem paginação com size alto
    const data = await api.get(`${userURL}?size=1000&sort=id,asc`);
    // Page<> retorna { content: [...], totalElements: N, ... }
    const users = data.data?.content ?? data.data ?? [];
    response = {
      status: 200,
      success: true,
      message: 'Usuários carregados com sucesso',
      data: users,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar usuários',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

const activateUser = async (id: number, roleName: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.patch(`${userURL}/${id}/ativar?roleName=${roleName}`);
    response = {
      status: 200,
      success: true,
      message: 'Usuário ativado com sucesso',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao ativar usuário',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

const UserService = {
  getAllUsers,
  activateUser,
};

export default UserService;

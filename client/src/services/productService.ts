import type { IProduct, IResponse } from '@/commons/types';
import { api } from '@/lib/axios';

const productURL = "/products";

/**
 * Função para salvar um produto
 * @param product - Dados do produto que será salvo
 * @returns - Retorna uma Promise com a resposta da API
 **/
const save = async (product: IProduct): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(productURL, product);
    response = {
      status: 200,
      success: true,
      message: "Produto salvo com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao salvar produto",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar todos os produtos
 * @returns - Retorna uma Promise com a resposta da API
 * com a lista de produtos
 **/
const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(productURL);
    response = {
      status: 200,
      success: true,
      message: "Lista de produtos carregada com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar a lista de produtos",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar produtos paginados
 * @param page - Página (padrão 0)
 * @param size - Tamanho da página (padrão 20)
 * @param order - Campo para ordenação (opcional)
 * @param asc - Ordem ascendente (opcional, padrão true)
 * @returns - Retorna uma Promise com a resposta da API
 */
const findAllPaged = async (page: number = 0, size: number = 20, order?: string, asc: boolean = true): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    let sortParam: string | undefined;
    if (order) {
      sortParam = `${order},${asc ? 'asc' : 'desc'}`;
    }
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(sortParam && { sort: sortParam })
    });
    const data = await api.get(`${productURL}/page?${params}`);
    response = {
      status: 200,
      success: true,
      message: "Produtos paginados carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar produtos paginados",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para remover um produto
 * @param id - Recebe o id do produto que será removido
 * @returns - Retorna uma Promise com a resposta da API
 */
const remove = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.delete(`${productURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Produto removido com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao remover o produto",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar um produto pelo id
 * @param id - Recebe o id do produto que será buscado
 * @returns - Retorna uma Promise com a resposta da API
 */
const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Produto carregado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar o produto",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Função para buscar produtos por nome da categoria
 * @param categoryName - Nome da categoria
 * @returns - Retorna uma Promise com a resposta da API
 */
const findByCategoryName = async (categoryName: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productURL}/category/name/${encodeURIComponent(categoryName)}`);
    response = {
      status: 200,
      success: true,
      message: "Produtos da categoria carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar produtos da categoria",
      data: err.response?.data || err.message,
    };
  }
  return response;
};

// Objeto que exporta todas as funções
const ProductService = {
  save,
  findAll,
  findAllPaged,
  remove,
  findById,
  findByCategoryName,
};

export default ProductService;

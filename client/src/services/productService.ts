import type { IProduct, IResponse } from '@/commons/types';
import { api } from '@/lib/axios';

const productURL = "/products";

/**
 * Salva um produto com imagem via multipart/form-data
 * Endpoint: POST /products/upload
 * Parts: "product" (JSON) + "image" (arquivo)
 */
const save = async (product: IProduct, imageFile?: File | null): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const formData = new FormData();

    // Part "product": JSON serializado como Blob com content-type application/json
    const productBlob = new Blob([JSON.stringify({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      urlImagem: product.urlImagem || '',
      category: product.category ? { id: product.category.id } : undefined,
    })], { type: 'application/json' });
    formData.append('product', productBlob);

    // Part "image": arquivo de imagem
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await api.post(`${productURL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    response = {
      status: data.status,
      success: true,
      message: 'Produto salvo com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: err.response?.data?.message || 'Falha ao salvar produto',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Busca todos os produtos
 */
const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(productURL);
    response = {
      status: 200,
      success: true,
      message: 'Lista de produtos carregada com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar a lista de produtos',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Busca produtos paginados
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
      ...(sortParam && { sort: sortParam }),
    });
    const data = await api.get(`${productURL}/page?${params}`);
    response = {
      status: 200,
      success: true,
      message: 'Produtos paginados carregados com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar produtos paginados',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Remove um produto pelo id
 */
const remove = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.delete(`${productURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: 'Produto removido com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao remover o produto',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Busca um produto pelo id
 */
const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: 'Produto carregado com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar o produto',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

/**
 * Busca produtos por nome da categoria
 */
const findByCategoryName = async (categoryName: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${productURL}/category/name/${encodeURIComponent(categoryName)}`);
    response = {
      status: 200,
      success: true,
      message: 'Produtos da categoria carregados com sucesso!',
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: 'Falha ao carregar produtos da categoria',
      data: err.response?.data || err.message,
    };
  }
  return response;
};

const ProductService = {
  save,
  findAll,
  findAllPaged,
  remove,
  findById,
  findByCategoryName,
};

export default ProductService;

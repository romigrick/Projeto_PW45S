export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: any
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  urlImagem: string;
  category: ICategory;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrderItem {
  product: { id: number };
  quantity: number;
}

export interface IOrderPayloadItem {
  product: { id: number };  
  quantity: number;
  price: number;
}

export interface IOrder {
  id?: number;
  address?: { id: number };
  shippingOption: 'standard' | 'express';
  paymentMethod: string;
  items: IOrderPayloadItem[];
  total?: number;
  status?: string;
  createdAt?: string;
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  data?: IOrder;
}

export interface IAddress {
  id?: number;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

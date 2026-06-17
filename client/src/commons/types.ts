export interface IUserRegister {
  displayName: string;
  username: string;
  email: string;
  password: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: any;
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
  orderDate?: string;
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

export interface IUser {
  id?: number;
  displayName: string;
  username: string;
  email?: string;
  active: boolean;       // campo real do UserDTO
  roles?: Set<string>;   // campo real do UserDTO — Set<String> no backend
}

// Alinhado com OrderAttachmentDTO do backend
export interface IAttachment {
  id?: number;
  originalFileName: string;
  contentType: string;
  fileSize?: number;
  uploadedAt: string;
  description?: string;
  uploadedBy?: string;
}

// Alinhado com OrderStatusHistoryDTO do backend
export interface IOrderStatusHistory {
  id?: number;
  previousStatus?: string;
  newStatus: string;
  changedBy?: string;
  changedAt: string;
  observation?: string;
}

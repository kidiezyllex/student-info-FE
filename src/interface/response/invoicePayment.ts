export interface IInvoicePayment {
  _id: string;
  homeId?: {
    _id: string;
    name?: string;
    address?: string;
  };
  guestId?: string;
  guestName?: string;
  homeContractId?: string;
  serviceContractId?: string;
  datePaymentExpec: string;
  totalReceive: number;
  type: number; // 1: Tiền thuê nhà, 2: Tiền dịch vụ
  statusPaym: number; // 1: Chưa thanh toán, 2: Đã thanh toán
  receiverId?: string;
  note?: string;
  daysUntilDue?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IInvoicePaymentSearchResult extends IInvoicePayment {}

export interface IInvoicePaymentListResponse {
  statusCode: number;
  message: string;
  data: IInvoicePayment[];
}

export interface IInvoicePaymentSearchResponse {
  statusCode: number;
  message: string;
  data: IInvoicePaymentSearchResult[];
}

export interface IInvoicePaymentDetailResponse {
  statusCode: number;
  message: string;
  data: IInvoicePayment;
}

export interface IInvoicePaymentCreateResponse {
  statusCode: number;
  message: string;
  data: IInvoicePayment;
}

export interface IInvoicePaymentUpdateResponse {
  statusCode: number;
  message: string;
  data: IInvoicePayment;
}

export interface IInvoicePaymentDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
}

export interface IInvoicePaymentGenerateResponse {
  statusCode: number;
  message: string;
  data: IInvoicePayment[];
} 
export interface IGetInvoicePaymentDetailParams {
  id: string;
}

export interface ISearchInvoicePaymentParams {
  q: string;
}

export interface IGetInvoicePaymentsByHomeContractParams {
  homeContractId: string;
}

export interface IGetInvoicePaymentsByServiceContractParams {
  serviceContractId: string;
}

export interface IGetInvoicePaymentsByHomeParams {
  homeId: string;
}

export interface ICreateInvoicePaymentBody {
  homeId?: string;
  guestId?: string;
  guestName?: string;
  homeContractId?: string;
  serviceContractId?: string;
  datePaymentExpec: string;
  totalReceive: number;
  type: number; // 1: Tiền thuê nhà, 2: Tiền dịch vụ
  statusPaym?: number; // 1: Chưa thanh toán, 2: Đã thanh toán
  receiverId?: string;
  note?: string;
}

export interface IUpdateInvoicePaymentParams {
  id: string;
}

export interface IUpdateInvoicePaymentBody {
  homeId?: string;
  guestId?: string;
  guestName?: string;
  homeContractId?: string;
  serviceContractId?: string;
  datePaymentExpec?: string;
  totalReceive?: number;
  type?: number;
  statusPaym?: number;
  receiverId?: string;
  note?: string;
}

export interface IUpdateInvoicePaymentStatusParams {
  id: string;
}

export interface IUpdateInvoicePaymentStatusBody {
  statusPaym: number;
}

export interface IDeleteInvoicePaymentParams {
  id: string;
}

export interface IGenerateInvoicePaymentForHomeContractParams {
  homeContractId: string;
}

export interface IGenerateInvoicePaymentForHomeContractBody {
  startDate?: string;
  endDate?: string;
  paymentCycle?: number;
  amount?: number;
}

export interface IGenerateInvoicePaymentForServiceContractParams {
  serviceContractId: string;
}

export interface IGenerateInvoicePaymentForServiceContractBody {
  startDate?: string;
  endDate?: string;
  paymentCycle?: number;
  amount?: number;
} 
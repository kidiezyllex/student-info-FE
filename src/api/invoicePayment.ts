import { sendGet, sendPost, sendPatch, sendDelete } from './axios';
import {
  IInvoicePaymentListResponse,
  IInvoicePaymentSearchResponse,
  IInvoicePaymentDetailResponse,
  IInvoicePaymentCreateResponse,
  IInvoicePaymentUpdateResponse,
  IInvoicePaymentDeleteResponse,
  IInvoicePaymentGenerateResponse
} from '@/interface/response/invoicePayment';
import {
  IGetInvoicePaymentDetailParams,
  ISearchInvoicePaymentParams,
  IGetInvoicePaymentsByHomeContractParams,
  IGetInvoicePaymentsByServiceContractParams,
  IGetInvoicePaymentsByHomeParams,
  ICreateInvoicePaymentBody,
  IUpdateInvoicePaymentParams,
  IUpdateInvoicePaymentBody,
  IUpdateInvoicePaymentStatusParams,
  IUpdateInvoicePaymentStatusBody,
  IDeleteInvoicePaymentParams,
  IGenerateInvoicePaymentForHomeContractParams,
  IGenerateInvoicePaymentForServiceContractParams,
  IGenerateInvoicePaymentForHomeContractBody,
  IGenerateInvoicePaymentForServiceContractBody
} from '@/interface/request/invoicePayment';

export const getInvoicePayments = async (): Promise<IInvoicePaymentListResponse> => {
  const res = await sendGet('/invoice-payments');
  return res;
};

export const getDueInvoicePayments = async (): Promise<IInvoicePaymentListResponse> => {
  const res = await sendGet('/invoice-payments/due');
  return res;
};

export const searchInvoicePayments = async (params: ISearchInvoicePaymentParams): Promise<IInvoicePaymentSearchResponse> => {
  const res = await sendGet(`/invoice-payments/search?q=${params.q}`);
  return res;
};

export const getInvoicePaymentsByHomeContract = async (params: IGetInvoicePaymentsByHomeContractParams): Promise<IInvoicePaymentListResponse> => {
  const res = await sendGet(`/invoice-payments/home-contract/${params.homeContractId}`);
  return res;
};

export const getInvoicePaymentsByServiceContract = async (params: IGetInvoicePaymentsByServiceContractParams): Promise<IInvoicePaymentListResponse> => {
  const res = await sendGet(`/invoice-payments/service-contract/${params.serviceContractId}`);
  return res;
};

export const getInvoicePaymentsByHome = async (params: IGetInvoicePaymentsByHomeParams): Promise<IInvoicePaymentListResponse> => {
  const res = await sendGet(`/invoice-payments/home/${params.homeId}`);
  return res;
};

export const getInvoicePaymentDetail = async (params: IGetInvoicePaymentDetailParams): Promise<IInvoicePaymentDetailResponse> => {
  const res = await sendGet(`/invoice-payments/${params.id}`);
  return res;
};

export const createInvoicePayment = async (body: ICreateInvoicePaymentBody): Promise<IInvoicePaymentCreateResponse> => {
  const res = await sendPost('/invoice-payments', body);
  return res;
};

export const updateInvoicePayment = async (params: IUpdateInvoicePaymentParams, body: IUpdateInvoicePaymentBody): Promise<IInvoicePaymentUpdateResponse> => {
  const res = await sendPatch(`/invoice-payments/${params.id}`, body);
  return res;
};

export const updateInvoicePaymentStatus = async (params: IUpdateInvoicePaymentStatusParams, body: IUpdateInvoicePaymentStatusBody): Promise<IInvoicePaymentUpdateResponse> => {
  const res = await sendPatch(`/invoice-payments/${params.id}/status`, body);
  return res;
};

export const deleteInvoicePayment = async (params: IDeleteInvoicePaymentParams): Promise<IInvoicePaymentDeleteResponse> => {
  const res = await sendDelete(`/invoice-payments/${params.id}`);
  return res;
};

export const generateInvoicePaymentForHomeContract = async (params: IGenerateInvoicePaymentForHomeContractParams, body: IGenerateInvoicePaymentForHomeContractBody): Promise<IInvoicePaymentGenerateResponse> => {
  const res = await sendPost(`/invoice-payments/generate/home-contract/${params.homeContractId}`, body);
  return res;
};

export const generateInvoicePaymentForServiceContract = async (params: IGenerateInvoicePaymentForServiceContractParams, body: IGenerateInvoicePaymentForServiceContractBody): Promise<IInvoicePaymentGenerateResponse> => {
  const res = await sendPost(`/invoice-payments/generate/service-contract/${params.serviceContractId}`, body);
  return res;
}; 
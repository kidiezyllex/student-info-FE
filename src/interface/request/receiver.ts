export interface IGetReceiversParams {
  // No specific params for getting all receivers in the provided spec
}

export interface ISearchReceiversParams {
  q: string;
}

export interface IGetReceiverDetailParams {
  id: string;
}

export interface ICreateReceiverBody {
  fullname: string;
  phone: string;
  email: string;
  bankAccount: string;
  bankName: string;
  address: string;
}

export interface IUpdateReceiverParams {
  id: string;
}

export interface IUpdateReceiverBody {
  phone?: string;
  bankAccount?: string;
}

export interface IDeleteReceiverParams {
  id: string;
} 
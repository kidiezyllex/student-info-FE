export interface IHomeOwner {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  bank: string;
  bankAccount: string;
  bankNumber: string;
  active: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IHomeOwnerResponse {
  statusCode: number;
  message: string;
  data: {
    owner: IHomeOwner;
  };
} 
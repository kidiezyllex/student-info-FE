export interface IGetGuestDetailParams {
  id: string;
}

export interface ISearchGuestParams {
  q: string;
}

export interface ICreateGuestBody {
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  hometown: string;
  note: string;
  gender?: boolean; // true for male, false for female
  avatarUrl?: string;
}

export interface IUpdateGuestParams {
  id: string;
}

export interface IUpdateGuestBody {
  fullname?: string;
  phone?: string;
  email?: string;
  citizenId?: string;
  citizen_date?: string;
  citizen_place?: string;
  birthday?: string;
  hometown?: string;
  note?: string;
  gender?: boolean;
  avatarUrl?: string;
}

export interface IDeleteGuestParams {
  id: string;
}

export interface IGetHomeContractsByGuestParams {
  guestId: string;
} 
export interface ISearchHomeContractParams {
  q: string;
}

export interface IGetHomeContractByHomeParams {
  homeId: string;
}

export interface IGetHomeContractByGuestParams {
  guestId: string;
}

export interface IGetHomeContractDetailParams {
  id: string;
}

export interface ICreateHomeContractBody {
  homeId: string;
  guestId: string;
  contractCode: string;
  dateStar: string;
  duration: number;
  price: number;
  deposit: number;
  payCycle: number;
}

export interface IUpdateHomeContractParams {
  id: string;
}

export interface IUpdateHomeContractBody {
  duration?: number;
  price?: number;
  deposit?: number;
  payCycle?: number;
  status?: number;
}

export interface IDeleteHomeContractParams {
  id: string;
} 
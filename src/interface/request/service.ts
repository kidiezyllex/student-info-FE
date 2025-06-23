export interface IGetServiceDetailParams {
  id: string;
}

export interface ISearchServiceParams {
  q: string;
}

export interface ICreateServiceBody {
  name: string;
  unit: string;
  description: string;
}

export interface IUpdateServiceParams {
  id: string;
}

export interface IUpdateServiceBody {
  name?: string;
  unit?: string;
  description?: string;
}

export interface IDeleteServiceParams {
  id: string;
} 
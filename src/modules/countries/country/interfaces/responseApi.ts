export interface ResponseApi {
  ok: boolean;
  data: Datum[];
  message: string;
}

export interface Datum {
  //_id?: any;
  name: string;
  slug: string;
  code: string;
  phonePrefix: string;
  active: boolean;
  edit: boolean;
  delete: boolean;
  createdAt: string;
  __v: number;
  updatedAt?: string;
  activeOnlypu: boolean;
  icon?: string;
}

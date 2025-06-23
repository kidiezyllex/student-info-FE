import { sendGet } from './axios';
import { IGuestContractResponse } from '@/interface/response/guestContract';
import { IGetGuestContractParams } from '@/interface/request/guestContract';

export const getGuestContract = async (params: IGetGuestContractParams): Promise<IGuestContractResponse> => {
  const res = await sendGet(`/guest-contracts/${params.guestId}`);
  return res;
}; 
import { useQuery } from '@tanstack/react-query';
import { getGuestContract } from '@/api/guestContract';
import { IGuestContractResponse } from '@/interface/response/guestContract';
import { IGetGuestContractParams } from '@/interface/request/guestContract';

export const useGetGuestContract = (params: IGetGuestContractParams) => {
  return useQuery<IGuestContractResponse, Error>({
    queryKey: ['guest-contracts', params.guestId],
    queryFn: () => getGuestContract(params),
    enabled: !!params.guestId,
  });
}; 
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/api/upload';
import { IUploadResponse } from '@/interface/response/upload';
import { IUploadFileBody } from '@/interface/request/upload';

export const useUploadFile = () => {
  return useMutation<IUploadResponse, Error, IUploadFileBody>({
    mutationFn: uploadFile,
  });
}; 
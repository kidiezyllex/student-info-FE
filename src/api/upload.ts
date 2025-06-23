import { sendPost } from './axios';
import { IUploadResponse } from '@/interface/response/upload';
import { IUploadFileBody } from '@/interface/request/upload';

export const uploadFile = async (body: IUploadFileBody): Promise<IUploadResponse> => {
  const formData = new FormData();
  formData.append('file', body.file);
  
  const res = await sendPost('/upload', formData);
  return res;
}; 
export interface IUploadResult {
  public_id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface IUploadResponse {
  statusCode: number;
  message: string;
  data: IUploadResult;
} 
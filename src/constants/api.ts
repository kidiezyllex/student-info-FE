export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    COMPLETE_REGISTRATION: '/auth/complete-registration',
  },
  EMAIL: {
    SEND_VERIFICATION: '/email/send-verification',
    VERIFY_CODE: '/email/verify-code',
  },
  VERIFICATION: {
    SEND_CODE: '/verification/send-code',
    VERIFY_CODE: '/verification/verify-code',
    SEND_PASSWORD_RESET: '/verification/send-password-reset',
  },
  USER: {
    GET_ALL: '/user',
    CREATE: '/user',
    UPDATE: '/user',
    DELETE: '/user',
  },
  DEPARTMENT: {
    GET_ALL: '/department',
    CREATE: '/department',
    UPDATE: '/department',
    DELETE: '/department',
  },
  EVENT: {
    GET_ALL: '/event',
    CREATE: '/event',
    UPDATE: '/event',
    DELETE: '/event',
  },
  SCHOLARSHIP: {
    GET_ALL: '/scholarship',
    CREATE: '/scholarship',
    UPDATE: '/scholarship',
    DELETE: '/scholarship',
  },
  NOTIFICATION: {
    GET_ALL: '/notification',
    CREATE: '/notification',
    UPDATE: '/notification',
    DELETE: '/notification',
  },
  DATASET: {
    GET_ALL: '/dataset',
    CREATE: '/dataset',
    UPDATE: '/dataset',
    DELETE: '/dataset',
  },
  MESSAGE: {
    GET_ALL: '/message',
    CREATE: '/message',
    UPDATE: '/message',
    DELETE: '/message',
  },
  CHAT: {
    GET_ALL: '/chat',
    CREATE: '/chat',
    UPDATE: '/chat',
    DELETE: '/chat',
  },
  AI: {
    CHAT: '/ai/chat',
  },
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
  },
};

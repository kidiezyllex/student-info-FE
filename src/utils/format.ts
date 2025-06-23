export const formatCurrency = (amount: number): string => {
  if (amount == null) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatContractStatus = (status: number): { label: string; color: string } => {
  switch (status) {
    case 0:
      return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' };
    case 1:
      return { label: 'Đang hiệu lực', color: 'bg-green-100 text-green-800' };
    case 2:
      return { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' };
    case 3:
      return { label: 'Đã hủy', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
  }
};

export const formatPayCycle = (payCycle: number): string => {
  switch (payCycle) {
    case 1:
      return 'Hàng tháng';
    case 3:
      return 'Hàng quý';
    case 6:
      return 'Nửa năm';
    case 12:
      return 'Hàng năm';
    default:
      return 'Không xác định';
  }
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const shortenText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const formatArea = (value: number): string => {
  return `${formatNumber(value)} m²`;
}; 
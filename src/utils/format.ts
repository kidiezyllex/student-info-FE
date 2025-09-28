export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
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
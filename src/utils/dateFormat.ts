export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}; 
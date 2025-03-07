// Constant for the API base URL
export const API_BASE_URL = "http://127.0.0.1:5000"

// import.meta.env.VITE_BACKEND_URL
//   ? `${import.meta.env.VITE_BACKEND_URL}`
//   : "http://localhost:3002";
// import.meta.env.VITE_BACKEND_URL || "http://172.18.4.46:3002"; // Fallback to localhost if not defined
// replace <localhost> with this device's IP address to access the website in your network

export function padZero(value) {
  return value.toString().padStart(2, "0");
}

export function formatDateWithPadding(date) {
  if (!date) return "N/A";

  date = new Date(date);

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  // Convert 24-hour time to 12-hour time
  hours = padZero(hours);

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString(undefined, options);
}
export function formatDate(timestamp) {
  if(timestamp){
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }else{
    return ""
  }
  
}

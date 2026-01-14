export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—';
  
  const numValue = Number(value);
  if (isNaN(numValue)) return '—';
  
  if (numValue >= 10000000) {
    return `₹${(numValue / 10000000).toFixed(1)} Cr`;
  }
  
  if (numValue >= 100000) {
    return `₹${(numValue / 100000).toFixed(1)} L`;
  }
  
  if (numValue >= 1000) {
    return `₹${(numValue / 1000).toFixed(0)}K`;
  }
  
  return `₹${Math.round(numValue).toLocaleString('en-IN')}`;
}

export function formatPercentage(value) {
  if (value === null || value === undefined) return '—';
  const numValue = Number(value);
  if (isNaN(numValue)) return '—';
  return `${numValue.toFixed(1)}%`;
}

export function formatAge(value) {
  if (value === null || value === undefined) return '—';
  const numValue = Number(value);
  if (isNaN(numValue)) return '—';
  return `${Math.round(numValue)} years`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  const numValue = Number(value);
  if (isNaN(numValue)) return '—';
  return numValue.toLocaleString('en-IN');
}
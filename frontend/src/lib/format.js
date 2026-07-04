export function dateInputValue(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

export function displayValue(value) {
  return value || '—';
}

export function buildQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const ROLE_OPTIONS = [
  { code: 'SYSADMIN', label: 'Сисадмин' },
  { code: 'CLUBHEAD', label: 'РК' },
  { code: 'FLIGHTMANAGER', label: 'РП' },
  { code: 'PILOT', label: 'Пилот' },
];

export const STATUS_OPTIONS = [
  { code: 'student', label: 'Ученик' },
  { code: 'active', label: 'Активный' },
  { code: 'inactive', label: 'Неактивный' },
];

export const RANK_OPTIONS = [
  { code: 'none', label: 'Без разряда' },
  { code: 'third_rank', label: '3-й разряд' },
  { code: 'second_rank', label: '2-й разряд' },
  { code: 'first_rank', label: '1-й разряд' },
  { code: 'above_first', label: '1-й разряд и выше' },
];

export function roleLabel(code) {
  return ROLE_OPTIONS.find((item) => item.code === code)?.label ?? code ?? 'Гость';
}

export function statusLabel(code) {
  return STATUS_OPTIONS.find((item) => item.code === code)?.label ?? code ?? '—';
}

export function rankLabel(code) {
  return RANK_OPTIONS.find((item) => item.code === code)?.label ?? code ?? '—';
}

export function rankTone(code) {
  return (
    {
      none: 'bg-muted text-muted-foreground',
      third_rank: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      second_rank: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      first_rank: 'bg-blue-100 text-blue-900 border-blue-200',
      above_first: 'bg-blue-100 text-blue-900 border-blue-200',
    }[code] ?? 'bg-muted text-muted-foreground'
  );
}

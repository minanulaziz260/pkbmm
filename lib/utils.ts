// Utility kecil untuk penggabungan className conditional tanpa dependency eksternal
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const kB = 1000;
const MB: number = 1000 * kB;

export function getDisplaySize(size: number): string {
  if (size < kB) {
    return `${size}B`;
  } else if (size < MB) {
    return `${(size/kB).toFixed(2)}kB`;
  } else {
    return `${(size/MB).toFixed(2)}MB`;
  }
}

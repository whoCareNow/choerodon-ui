const ROOT_FONT_SIZE = 100;

export function pxToRem(value: number): string {
  return `${value / ROOT_FONT_SIZE}rem`;
}

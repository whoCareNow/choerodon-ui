import { RequiredMarkAlign } from './enum';
import { LabelWidth } from './FormContext';

export const FIELD_SUFFIX = 'field';

export function normalizeLabelWidth(
  labelWidth: LabelWidth | undefined,
  columns = 1,
): (number | 'auto')[] {
  if (!labelWidth) {
    return Array.from({ length: columns }, () => 100);
  }
  if (Array.isArray(labelWidth)) {
    const result = [...labelWidth];
    while (result.length < columns) {
      result.push(result[result.length - 1] ?? 100);
    }
    return result.slice(0, columns);
  }
  if (typeof labelWidth === 'number' || labelWidth === 'auto') {
    return Array.from({ length: columns }, () => labelWidth);
  }
  return Array.from({ length: columns }, () => 100);
}

export function getRequiredMarkAlign(align?: RequiredMarkAlign): RequiredMarkAlign {
  if (align === RequiredMarkAlign.left || align === RequiredMarkAlign.right) {
    return align;
  }
  return RequiredMarkAlign.left;
}

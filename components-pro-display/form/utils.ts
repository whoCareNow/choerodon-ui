import { RequiredMarkAlign } from './enum';
import { LabelWidth } from './FormContext';

export const FIELD_SUFFIX = 'field';

export function normalizeLabelWidth(labelWidth: LabelWidth | undefined): (number | 'auto')[] {
  if (!labelWidth) {
    return [100];
  }
  if (Array.isArray(labelWidth)) {
    return labelWidth;
  }
  if (typeof labelWidth === 'number' || labelWidth === 'auto') {
    return [labelWidth];
  }
  return [100];
}

export function getRequiredMarkAlign(align?: RequiredMarkAlign): RequiredMarkAlign {
  if (align === RequiredMarkAlign.left || align === RequiredMarkAlign.right) {
    return align;
  }
  return RequiredMarkAlign.left;
}

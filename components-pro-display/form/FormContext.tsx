import { createContext } from 'react';
import { LabelAlign, LabelLayout, RequiredMarkAlign } from './enum';

export type LabelWidth = number | 'auto' | (number | 'auto')[];

export interface FormContextValue {
  labelLayout?: LabelLayout;
  labelWidth?: LabelWidth;
  labelAlign?: LabelAlign;
  useColon?: boolean;
  requiredMarkAlign?: RequiredMarkAlign;
  disabled?: boolean;
}

const FormContext = createContext<FormContextValue>({
  labelLayout: LabelLayout.horizontal,
  labelWidth: 100,
  labelAlign: LabelAlign.right,
  useColon: false,
  requiredMarkAlign: RequiredMarkAlign.left,
  disabled: false,
});

export default FormContext;

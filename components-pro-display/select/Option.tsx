import { Component, ReactNode } from 'react';

export interface OptionProps {
  value?: string | number;
  disabled?: boolean;
  children?: ReactNode;
}

/* eslint-disable react/prefer-stateless-function,react/no-unused-prop-types */
export default class Option extends Component<OptionProps> {
  static __PRO_OPTION = true;
}

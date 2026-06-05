import { createContext, useContext } from 'react';
import {
  getDisplayConfig,
  getDisplayTooltip,
  getPrefixCls,
  getProPrefixCls,
} from './config';

export interface DisplayConfigContextValue {
  getConfig: typeof getDisplayConfig;
  getPrefixCls: typeof getPrefixCls;
  getProPrefixCls: typeof getProPrefixCls;
  getTooltip: typeof getDisplayTooltip;
}

const defaultValue: DisplayConfigContextValue = {
  getConfig: getDisplayConfig,
  getPrefixCls,
  getProPrefixCls,
  getTooltip: getDisplayTooltip,
};

const DisplayConfigContext = createContext<DisplayConfigContextValue>(defaultValue);

export function useDisplayConfig(): DisplayConfigContextValue {
  return useContext(DisplayConfigContext);
}

export default DisplayConfigContext;

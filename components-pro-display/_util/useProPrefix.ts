import { useMemo } from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

export default function useProPrefix(suffixCls: string, customizePrefixCls?: string): string {
  const { getProPrefixCls } = useDisplayConfig();
  return useMemo(
    () => getProPrefixCls(suffixCls, customizePrefixCls),
    [getProPrefixCls, suffixCls, customizePrefixCls],
  );
}

export const DEFAULT_PREFIX_CLS = 'c7n';
export const DEFAULT_PRO_PREFIX_CLS = 'c7n-pro';
export const DEFAULT_ICONFONT_PREFIX = 'icon';

export interface DisplayConfig {
  prefixCls?: string;
  proPrefixCls?: string;
  iconfontPrefix?: string;
  buttonFuncType?: string;
  buttonColor?: string;
  autoInsertSpaceInButton?: boolean;
}

const config: Required<Pick<DisplayConfig, 'prefixCls' | 'proPrefixCls' | 'iconfontPrefix'>> &
  DisplayConfig = {
    prefixCls: DEFAULT_PREFIX_CLS,
    proPrefixCls: DEFAULT_PRO_PREFIX_CLS,
    iconfontPrefix: DEFAULT_ICONFONT_PREFIX,
    autoInsertSpaceInButton: true,
  };

export function getDisplayConfig<K extends keyof DisplayConfig>(key: K): DisplayConfig[K] {
  return config[key];
}

export function configureDisplay(partial: DisplayConfig) {
  Object.assign(config, partial);
}

export function getPrefixCls(suffixCls: string, customizePrefixCls?: string): string {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return `${config.prefixCls}-${suffixCls}`;
}

export function getProPrefixCls(suffixCls: string, customizePrefixCls?: string): string {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return `${config.proPrefixCls}-${suffixCls}`;
}

export function getDisplayTooltip(): undefined {
  return undefined;
}

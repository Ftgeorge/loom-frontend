import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let typeClass = '';
  if (type === 'default') typeClass = 'text-base leading-6';
  else if (type === 'defaultSemiBold') typeClass = 'text-base leading-6 font-semibold';
  else if (type === 'title') typeClass = 'text-[32px] font-bold leading-[32px]';
  else if (type === 'subtitle') typeClass = 'text-xl font-bold';
  else if (type === 'link') typeClass = 'text-base leading-[30px] text-[#0a7ea4]';

  return (
    <Text
      className={typeClass}
      style={[{ color }, style]}
      {...rest}
    />
  );
}

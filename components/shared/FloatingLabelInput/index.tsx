import { useEffect, useState } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import classes from './FloatingLabelInput.module.css';

interface IFloatingLabelInputProps extends TextInputProps {}

export function FloatingLabelInput({
  label,
  placeholder,
  value,
  defaultValue,
  required,
  onChange,
  onFocus,
  onBlur,
  ...props
}: IFloatingLabelInputProps) {
  const [focused, setFocused] = useState(false);
  const [valueInput, setValue] = useState((value as string) ?? (defaultValue as string) ?? '');
  const floating = focused || valueInput?.trim()?.length !== 0 || undefined;

  useEffect(() => {
    setValue(value as string);
  }, [value]);

  return (
    <TextInput
      label={label || 'Floating label input'}
      placeholder={placeholder || 'Placeholder'}
      classNames={classes}
      value={value ?? ''}
      withAsterisk={required}
      defaultValue={defaultValue}
      onFocus={(e) => {
        setFocused(true);
        onFocus && onFocus(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur && onBlur(e);
      }}
      onChange={(e) => {
        setValue(e.currentTarget.value);
        onChange && onChange(e);
      }}
      mt='md'
      autoComplete='nope'
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
      {...props}
    />
  );
}

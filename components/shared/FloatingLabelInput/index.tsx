import { useState } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import classes from './FloatingLabelInput.module.css';

interface IFloatingLabelInputProps extends TextInputProps {}

export function FloatingLabelInput({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  ...props
}: IFloatingLabelInputProps) {
  const [focused, setFocused] = useState(false);
  const [valueInput, setValue] = useState((value as string) || (defaultValue as string) || '');
  const floating = valueInput.trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      label={label || 'Floating label input'}
      placeholder={placeholder || 'Placeholder'}
      required
      classNames={classes}
      value={value}
      defaultValue={defaultValue}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
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

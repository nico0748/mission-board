import React from 'react';
import clsx from 'clsx';
import './atoms.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'ghost-danger';
  size?: 'md' | 'sm';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}) => (
  <button
    className={clsx('btn', variant, size, className)}
    {...rest}
  />
);

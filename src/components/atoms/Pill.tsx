import React from 'react';
import clsx from 'clsx';
import './atoms.css';

type PillProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  soft?: boolean;
  icon?: React.ReactNode;
  as?: 'button' | 'span';
};

export const Pill: React.FC<PillProps> = ({ active, soft, icon, children, as = 'span', className, ...rest }) => {
  const Comp: any = as === 'button' ? 'button' : 'span';
  return (
    <Comp
      className={clsx('pill', { active, soft }, className)}
      {...rest}
    >
      {icon && <span className="pill-icon">{icon}</span>}
      {children}
    </Comp>
  );
};

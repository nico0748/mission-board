import React from 'react';
import clsx from 'clsx';
import './atoms.css';

type TagProps = {
  tone?: 'success' | 'warning' | 'default' | 'soft';
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export const Tag: React.FC<TagProps> = ({ tone = 'default', icon, children }) => (
  <span className={clsx('tag', tone)}>
    {icon && <span className="pill-icon">{icon}</span>}
    {children}
  </span>
);

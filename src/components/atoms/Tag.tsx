import React from 'react';
import clsx from 'clsx';
import './atoms.css';

type TagProps = {
  tone?: 'success' | 'warning' | 'default' | 'soft';
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Tag: React.FC<TagProps> = ({ tone = 'default', icon, children, style }) => (
  <span className={clsx('tag', tone)} style={style}>
    {icon && <span className="pill-icon">{icon}</span>}
    {children}
  </span>
);

import type React from 'react';

// Button component with variant styles
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  const cls = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');
  return <button className={cls} {...rest} />;
}

'use client';

import { type ReactNode } from 'react';
import { Notice, type NoticeVariant } from './notice';

export interface AlertProps {
  variant: NoticeVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({ variant, title, children, onClose, className }: AlertProps) {
  return (
    <Notice variant={variant} placement="inline" title={title} onClose={onClose} className={className}>
      {children}
    </Notice>
  );
}

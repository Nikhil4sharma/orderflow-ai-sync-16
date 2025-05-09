
import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
  showFor: string[];
  badge: number | null;
}

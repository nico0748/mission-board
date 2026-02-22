import React from 'react';
import { ShowcaseGrid } from '../organisms/ShowcaseGrid';
import type { ShowcaseEntry } from '../../types';

export const ShowcasePanel: React.FC<{ items: ShowcaseEntry[] }> = React.memo(({ items }) => (
  <ShowcaseGrid items={items} />
));

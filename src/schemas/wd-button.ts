// src/providers/schemas/wd-button.ts
import { loadComponentSchema } from '../utils/schema-loader';

export interface ComponentMeta {
  name: string;
  props: Array<{
    name: string;
    type: 'enum' | 'boolean' | 'string' | 'number';
    values?: string[];
    description: string;
    default?: string;
  }>;
  events: Array<{ name: string; description: string }>;
  documentation: string;
}

const BUTTON_META = loadComponentSchema('button');

export default BUTTON_META;

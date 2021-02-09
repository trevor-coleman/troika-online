import { KeyList } from './KeyList';

export interface Item {
  [key: string]: any,

  armourPiercing: boolean,
  characters?: KeyList,
  charges?: {
    initial: number; max: number
  };
  customSize: boolean,
  damage?: number[],
  damagesAs?: string
  description: string,
  doesDamage: boolean,
  hasModifiers: boolean,
  name: string,
  protection?: number,
  protects: boolean
  size: number,
  ranged: boolean
  modifiers: KeyList,
  hasCharges: boolean,
  twoHanded: boolean,

}

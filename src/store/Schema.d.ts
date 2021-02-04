import {
  Skill,
  OtherItem,
  Weapon,
  Spell,
  InventoryItem,
} from '../types/troika';
import { Profile } from './index';

export default interface Schema {
  queryTest:any
  addFriendResult: any,
  sentRequests: any,
  portraits: any,
  characterSkills: {
    [key:string]: Skill
  },
  profiles: Profile,
  skills: Skill,
  items: {
    [key: string]: OtherItem
  },
  weapons: {
    [key: string]: Weapon
  },
  spells: {
    [key: string]: Spell
  },
  addSkills_mySkills: Skill,
  addSkills_srdSkills: Skill,
  addItems_myItems: Skill,
  addItems_srdItems: Skill,
  games: Game,
  rolls: {[key:string]: FbRoll },
  characters: Character
}

export interface FbRoll {
  title: string,
  rollUnder: number,
  dice: number[],
  roll: number[],
  total: number
}

export interface Game {
  name: string,
  sort_name: string,
  createdOn: Date,
  players?: KeyList
  invited?: KeyList
  characters?: KeyList
  owner: string;

  [key: string]: any,
}

export interface KeyList {
  [key: string]: boolean;
}

export interface Profile {
  name: string;
  email: string;
  invitations: KeyList;
  games: KeyList
  sentRequests: KeyList;
  receivedRequests: KeyList;

  friends: KeyList
}

export interface Character {
  game: string;
  portrait: string;
  owner: string;
  player: string;
  isTemplate: boolean;
  name: string;
  sort_name: string;
  background: string;
  special: string;
  skill: number;
  stamina_current:number;
  stamina_max: number;
  luck_current: number;
  luck_max:number;
  monies: number;
  provisions: number;
  items: KeyList;
  equipped: KeyList;
  skills: KeyList;
  skillValues: {[key:string]:SkillValues}
  possessions: InventoryItem[],
}

export interface SkillValues {
  skill: number,
  rank: number,
  used: boolean
}

export interface Skill {
  owner: string,
  character: string,
  name: string,
  description: string,
}


export interface Possession {
  name: string,
  characters: KeyList,
  description: string,
  size: number,
  protects: boolean
  protection?: number,
  doesDamage: boolean,
  damagesAs?: string
  damage?: number[],
  armourPiercing: boolean,
  hasModifiers: boolean,
  customSize: boolean,
  modifiers: KeyList,
  hasCharges: boolean,
  hasModifiers: boolean,
  charges?: {
    initial: number; max: number
  };
}

export interface Armour extends InventoryItem {
  type: "armour"
  protection: number,
}

export interface Weapon extends InventoryItem {
  type: "weapon",
  damage: number[],
  twoHanded: boolean,
  armourPiercing: boolean,
  charges?: {
    current: number; max: number
  };
}

export interface Item extends InventoryItem {
  type: "item"

  modifiers: Modifier[];
}

export type Target = "self" | "enemy" | "player" | "object";

export interface Modifier {
  skills: string[] | "*",
  value: number;
  type: "equipped" | "permanent" | "one-roll",
  targetTypes: Target[],
  targets: string[],
}

export type Damage =[number, number, number, number, number, number, number];

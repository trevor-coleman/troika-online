import {
  Skill, OtherItem, Weapon, Spell, InventoryItem,
} from '../types/troika';
import { Profile } from './index';

export default interface Schema {
  [key:string]: any,
  addSrdItems: Item,
  queryTest: any,
  addFriendResult: any,
  sentRequests: any,
  portraits: any,
  characterSkills: {
    [key: string]: Skill
  },
  profiles: Profile,
  skills: Skill,
  items: Item,
  spells: {
    [key: string]: Spell
  },
  addSkills_mySkills: Skill,
  addSkills_srdSkills: Skill,
  srdItems: Item,
  games: Game,
  rolls: { [key: string]: FbRoll },
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

export interface NullableKeyList {
  [key: string]: boolean|null;
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
  stamina_current: number;
  stamina_max: number;
  luck_current: number;
  luck_max: number;
  monies: number;
  provisions: number;
  items: { [key:string]:Item };
  inventory: string[];
  equipped: KeyList;
  skills: KeyList;
  skillValues: { [key: string]: SkillValues }
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

export interface Item {
  [key:string]: any,
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




export type Target = "self" | "enemy" | "player" | "object";

export interface Modifier {
  skills: string[] | "*",
  value: number;
  type: "equipped" | "permanent" | "one-roll",
  targetTypes: Target[],
  targets: string[],
}

export type Damage = [number, number, number, number, number, number, number];

import {
  Skill,
  Item,
  Weapon,
  Spell,
  Character, Possession,
} from '../types/troika';
import { Profile } from './index';

export default interface Schema {
  addFriendResult: any,
  sentRequests: any,
  profiles: Profile,
  skills: { [key: string]: Skill },
  items: {
    [key: string]: Item
  },
  weapons: {
    [key: string]: Weapon
  },
  spells: {
    [key: string]: Spell
  },
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
  skills: { skill: Skill, rank: number, level: number }[],
  possessions: Possession[],
}

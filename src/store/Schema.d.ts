import { Skill, Item, Weapon, Spell } from '../types/troika';
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
  owner: string;

  [key: string]: any,
}

export interface KeyList {
  [key: string]: boolean;
}

export interface Profile {
  name: string;
  email: string;
  games: KeyList
  sentRequests: KeyList;
  receivedRequests: KeyList;
  friends: KeyList
}

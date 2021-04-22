import { ChargesStepperState } from '../components/items/ChargesStepper';
import { RollProps } from '../contexts/GameContext';
import {
  Spell,
} from '../types/troika';
import { Profile } from './index';
import { WeaponsState } from '../components/weapons/CharacterWeapons';
import { CharacterItemsState } from '../components/items/CharacterItems';
import { KeyList } from './KeyList';
import { Item } from './Item';
import { WeaponTableRowState } from '../components/weapons/WeaponTableRow';

type CharacterEditorState = {
    rolls: RollProps[]
}

export default interface Schema {
  [key:string]: any,
  characterEditor: CharacterEditorState,
  characterItems: CharacterItemsState,
  chargesStepper: ChargesStepperState,
  editSkill: Skill,
  skillTableRow: SkillTableRow,
  skillText: SkillValues,
  skillSelectItem: Skill,
  lastRoll: RollProps,
  skillInfoButton: {[key:string]: Skill}
  itemInfoButton: {[key:string]: Item}
  addItemsDialog: {inventory: string[], weapons:[]},
  weaponTableRow: WeaponTableRowState,
  damageSection: { damage:number[], doesDamage:boolean, damagesAs:string, twoHanded:boolean, ranged: boolean, armourPiercing: boolean, weapons: string[] },
  weapons: WeaponsState,
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
  rolls: {[key:string]:RollProps},
  characters: Character
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
  skillList: string[];
  stamina_current: number;
  stamina_max: number;
  luck_current: number;
  luck_max: number;
  monies: number;
  provisions: number;
  items: { [key:string]:Item };
  inventory: string[];
  equipped: KeyList;
  skills: { [key:string] : Skill };
  skillValues: { [key: string]: SkillValues }
}

export interface SkillValues {
  skill: number,
  rank: number,
  used?: boolean
}

export interface Skill {
  owner: string,
  character: string,
  name: string,
  description: string,
  isSpell: boolean,
  staminaCost: number,
}


export interface SkillTableRow {
  [key:string]: Skill & {rank: number, used: boolean},
  name: string,
  stamina_current: number,
  totalSkill: number,
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

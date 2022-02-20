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
import MoniesAndProvisions from "../components/moniesAndProvisions/MoniesAndProvisions";

type CharacterEditorState = {
    rolls: RollProps[]
}

export default interface Schema {
  [key:string]: any,
  addPlayersSearchResult:Profile,
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
  inventoryItem: Item,
  weapons: WeaponsState,
  addSrdItems: Item,
  queryTest: any,
  addFriendResult: any,
  sentRequests: any,
  portraits: any,
  moniesAndProvisions: MoniesAndProvisions,
  characterSkills: {
    [key: string]: Skill
  },
  profiles: Profile,
  baseStats: BaseStats,
  bios: Bio,
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
  characters: Character,
}

export interface MoniesAndProvisions {
  monies: number,
  provisions: number
}

export interface Game {
  name: string,
  sort_name: string,
  createdOn: Date,
  players?: KeyList
  invited?: KeyList
  characters?: KeyList
  enableDiscord?: boolean,
  discordWebhookUrl?: string,
  owner: string;
  slug: string;
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
  background: string;
  equipped: KeyList;
  game: string;
  inventory: string[];
  inventoryPositions: {[key:string]: number},
  isTemplate: boolean;
  items: { [key:string]:Item };
  luck_current: number;
  luck_max: number;
  monies: number;
  name: string;
  owner: string;
  player: string;
  portrait: string;
  provisions: number;
  skill: number;
  skillList: string[];
  skillValues: { [key: string]: SkillValues }
  skills: { [key:string] : Skill };
  sort_name: string;
  special: string;
  stamina_current: number;
  stamina_max: number;
}

export interface BaseStats {
  luck_current: number;
  luck_max: number;
  skill: number;
  stamina_current: number;
  stamina_max: number;
}

export interface Bio {
  name:string,
  special:string,
  background:string,
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

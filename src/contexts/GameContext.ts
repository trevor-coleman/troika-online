import React from 'react';

export type RollProps =
    IRollSkillProps
    | IRollWeaponProps
    | IRollBasicProps |
    IRollDamageProps | IRollSpellProps

export type RollType = "skill" | "weapon" | "basic" | "damage" | "spell"

export type RollFormatter = (props: RollProps) => IRollText

export type RollSuccessChecker = (roll: number[], total: number)=> boolean;

export interface IRollText {
  title: string,
  description?: string,
  result: string,
  success?: boolean
}

export interface IRollBaseProps {
  key?: string,
  rollerKey: string,
  type: RollType,
  title ?: string,
  rollerName: string,
  success?: boolean,
  roll?: number[],
  dice: number[],
  description?: string,
  total?: number,
  lastRoll?: {key:string, value: RollProps | null } | null,
  result?: string,
}

export interface IRollDamageProps extends IRollBaseProps {
  type: "damage",
  weaponKey: string,
  rolledWeapon: string,
  damage: number[]
}



export interface IRollSkillProps extends IRollBaseProps {
  type: "skill",
  rolledSkill: string,
  target: number,
}

export interface IRollSpellProps extends IRollBaseProps {
  type: "spell",
  rolledSkill: string,
  target: number,
}

export interface IRollWeaponProps extends IRollBaseProps {
  type: "weapon",
  rolledWeapon: string,
  weaponKey: string,
  rolledSkill: string,
  rank: number,
  skill: number,
}

export interface IRollBasicProps extends IRollBaseProps {
  type: "basic",
  rollerName: string,
}

export type TGameContext = {
  id: string;
  lastRoll: { key:string, value: RollProps | null } | null;
  lastSeen: string | null;
  setLastSeen: (key: string) => void;
  roll: (props: RollProps) => Promise<string | null>
}

export const GameContext = React.createContext<TGameContext>({
  id         : "",
  lastSeen   : "",
  setLastSeen: (key: string) => {},
  lastRoll   : {key:"", value: null},
  roll       : async (props: RollProps) => {
    console.error("Tried to roll with default game context");
    return null;
  },
});

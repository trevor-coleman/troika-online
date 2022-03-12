import React from 'react';

export type RollProps =
    IRollSkillProps
    | IRollWeaponProps
    | IRollBasicProps
    | IRollDamageProps
    | IRollSpellProps
    | IRollInventoryProps
    | IRollToAdvanceProps
    | IRollToAdvanceSecondRollProps
    | IRollProvisionsProps

export type RollType =
    "skill"
    | "weapon"
    | "basic"
    | "damage"
    | "spell"
    | "inventory"
    | "advance"
    | "second"
    |"provisions"

export type RollFormatter = (props: RollProps) => IRollResult
export interface IRollResult {
  title: string,
  dialogDetail: string,
  discordDescription: string,
  dialogResult: string,
  success?: boolean,
  damage?: number[]
}

export interface IRollBaseProps {
  key?: string,
  rollerKey: string,
  type: RollType,
  title?: string,
  rollerName?: string,
  success?: boolean,
  roll?: number[],
  dice: number[],
  dialogDetail?: string,
  discordDescription?: string,
  total?: number,
  lastRoll?: { key: string, value: RollProps | null } | null,
  dialogResult?: string,
  discordResult?: string,
  damage?: number[],
  delta?:number
}

export interface IRollProvisionsProps extends IRollBaseProps {
  type: "provisions",
  currentStamina:number,
  maxStamina:number,
  currentProvisions: number,
}

export interface IRollDamageProps extends IRollBaseProps {
  type: "damage",
  weaponKey: string,
  rolledWeapon: string,
  damage: number[]
}

export interface IRollInventoryProps extends IRollBaseProps {
  type: "inventory",
  itemName: string,
  position: number,
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

export interface IRollToAdvanceProps extends IRollBaseProps {
  type: "advance",
  rolledSkillName: string,
  rolledSkillKey: string,
  rolledSkillRank: number,
  target: number,
}

export interface IRollToAdvanceSecondRollProps extends IRollBaseProps {
  type: 'second',
  rolledSkillName: string,
  rolledSkillKey: string,
  rolledSkillRank: number,
  target: number,
}

export type TGameContext = {
  id: string; lastRoll: { key: string, value: RollProps | null } | null; lastSeen: string | null; setLastSeen: (key: string) => void; roll: (props: RollProps) => Promise<string | null>
}

// noinspection JSUnusedLocalSymbols
export const GameContext = React.createContext<TGameContext>({
  id         : "",
  lastSeen   : "",
  setLastSeen: (key: string) => {},
  lastRoll   : {
    key  : "",
    value: null,
  },
  roll       : async (props: RollProps) => {
    console.error("Tried to roll with default game context");
    return null;
  },
});

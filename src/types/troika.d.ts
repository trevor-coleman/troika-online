
export interface Background {
  name: string;
  description: string;
  official: boolean;
  createdBy: string;
  createdOn: Date;
  skills: Skill[];

}


export type Possession = Weapon | Armour | Item;

export interface InventoryItem {
  name: string,
  description: string,
  size: number,
  type: "weapon" | "armour" | "item"
}

export interface Armour extends InventoryItem {
  type: "armour"
  protection: number,
}

export interface Weapon extends InventoryItem{
  type: "weapon",
  damage: number[],
  twoHanded: boolean,
  armourPiercing: boolean,
  charges?: {
    current: number;
    max: number
  };
}

export interface Item extends InventoryItem {
  type: "item"
  charges?: {
    current: number;
        max: number };
  modifiers: Modifier[];
  usedBy: string[];
  equipped: boolean;
}

export type Target = "self" | "enemy" | "player" | "object";

export interface Modifier {
  skills: string[] | "*",
  value: number;
  type: "equipped" | "permanent" | "one-roll",
  targetTypes: Target[],
  targets: string[],
}

export interface Roll {
  dice: Die[],
  under: number,
  result: number,
}

export interface Die {
  sides: "3" | "6"
}


export interface Spell {
  castingCost: number,
  description: string;
  modifier: Modifier;
  targets: Target[]
}

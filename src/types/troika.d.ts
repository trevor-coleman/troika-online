
export interface Background {
  name: string;
  description: string;
  official: boolean;
  createdBy: string;
  createdOn: Date;
  skills: Skill[];

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

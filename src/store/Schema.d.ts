import { Skill, Item, Weapon, Spell } from '../types/troika';

export default interface Schema {
  skills: {
    [key: string]: {
      [key: string]: Skill
    }
  },
  items: {
    [key: string]: {
      [key: string]: Item
    }
  },
  weapons: {
    [key: string]: {
      [key: string]: Weapon
    }
  },
  spells: {
    [key: string]: {
      [key: string]: Spell
    }
  },

}

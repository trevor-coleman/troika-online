import React from 'react';
import { FbRoll } from '../store/Schema';

export interface IGameContextRollProps {
  rollerName: string,
  rolledAbility: string,
  dice: number[],
  target?: number,
  lastRoll?: any,
}

export type TGameContext = {
  id: string;
  roll: (props: IGameContextRollProps) => Promise<string | null>;
  lastRoll: any;
}

export const GameContext = React.createContext<TGameContext>({
  id       : "",
  lastRoll: null,
  roll     : async (props: IGameContextRollProps) => {
    console.error("Tried to roll with default game context");
    return null;
  },
});

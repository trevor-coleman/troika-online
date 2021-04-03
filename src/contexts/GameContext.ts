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
  lastSeen: string | null,
  setLastSeen: (key:string)=>void;
}

export const GameContext = React.createContext<TGameContext>({
  id       : "",
  lastSeen: null,
  setLastSeen: (key:string)=>{},
  lastRoll: null,
  roll     : async (props: IGameContextRollProps) => {
    console.error("Tried to roll with default game context");
    return null;
  },
});

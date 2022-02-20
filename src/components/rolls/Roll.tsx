import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { RollProps } from '../../contexts/GameContext';
import Dice from './Dice';

interface RollComponentProps {
  rollKey: string;
  animate?: boolean;
  roll: { key: string, value: RollProps | null } ;
}

//COMPONENT
const Roll: FunctionComponent<RollComponentProps> = (props: RollComponentProps) => {
  const {
    roll,
    rollKey,
  } = props;


  return (
      roll?.value
      ? <div>
        <Dice
            rollKey={rollKey}  {...roll.value}
            animate />
        </div>
      : <div>No Roll</div>
  );

};

makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Roll;

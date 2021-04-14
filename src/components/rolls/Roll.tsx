import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { RollProps } from '../../contexts/GameContext';
import stringHash from './stringHash';
import Dice from './Dice';
import Button from '@material-ui/core/Button';

interface RollComponentProps {
  rollKey: string;
  animate?: boolean;
  roll: { key: string, value: RollProps | null } ;
}

//COMPONENT
const Roll: FunctionComponent<RollComponentProps> = (props: RollComponentProps) => {
  const {
    animate,
    roll,
    rollKey,
  } = props;
  console.log(roll);

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

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Roll;

import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import stringHash from './stringHash';
import Dice from './Dice';
import { FbRoll } from '../../store/Schema';
import Button from '@material-ui/core/Button';

interface RollProps {

  rollKey: string;
  animate?: boolean;
  roll: {key:string, value: FbRoll };
}


//COMPONENT
const Roll: FunctionComponent<RollProps> = (props: RollProps) => {
  const {animate, roll, rollKey} = props;
  console.log(roll)

  return (<div><Dice rollKey={rollKey}  {...roll.value} animate /></div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Roll;

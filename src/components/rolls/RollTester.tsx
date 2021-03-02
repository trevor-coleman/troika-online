import React, { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { rollKey } from './rollKey';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import Button from '@material-ui/core/Button';
import { useTypedSelector } from '../../store';
import Roll from './Roll';

interface RollTesterProps {
  gameKey:string;
}



//COMPONENT
const RollTester: FunctionComponent<RollTesterProps> = (props: RollTesterProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const firebase=useFirebase();

  useFirebaseConnect([
    {path: `rolls/${gameKey}`, queryParams:['orderByKey', 'limitToLast=10']}
  ])

  const rolls = useTypedSelector(state => {
    const {data} =  state.firebase;
    return data.rolls && data.rolls[gameKey]
           ? data.rolls[gameKey]
           : {};
  });

  let results: { [key:number]: number }= {};

  const newRoll=async (dice:number[])=> {
    const rollsRef = firebase.ref(`/rolls/${gameKey}`)
    const newRef =  rollsRef.push();

    const{key} = newRef;

    await newRef.set({
      title: `Test Roll - ${key}`,
      dice,
      roll: rollKey(key ?? "", dice),
      total: 5
    })
  }

  return (
      <div>
        <Button onClick={()=>newRoll([6,6])}>New Roll</Button>
        {Object.keys(rolls).reverse().map((rollKey:any)=> {
          const thisRoll: any = rolls[rollKey];
          return <div key={rollKey}><Roll
                rollKey={rollKey}
                            roll={thisRoll} /><Button onClick={()=>firebase.set(`rolls/${gameKey}/${rollKey}`, null)}>Delete</Button></div>;
        })}
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default RollTester;

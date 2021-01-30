import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Die from './Die';
import Grid from '@material-ui/core/Grid';
import random from '../../utils/SeededRandom';

interface DiceProps {
  rollKey: string,
  dice: number[],
  roll: number[],
  animate?: boolean;
}

const seedRandom = (s:number) => () => {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

//COMPONENT
const Dice: FunctionComponent<DiceProps> = (props: DiceProps) => {
  const {dice, roll, rollKey} = props;
  const animate = props.animate ?? true;

  const numberOfDice = dice.length;
  const theme =useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
        <Grid container >
      <Box className={classes.dieContainer} >
          <Paper>
        <Box m={2} p={2}>
          <Grid item container spacing={2}>
            {roll.map(
                (die:number, index:number)=>
                    <Grid
                        key={`${rollKey}-${index}`}
                        className={classes.roll} item>
                      <Die
                          dieRoll={die}
                          animate={animate}
                      />
                    </Grid>)}
        </Grid>
        </Box>
      </Paper>
      </Box>
        </Grid>
      )
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      dieContainer: {
        flexGrow: 1
      },
      roll: {
        display:"inline-block",
        border: "1px solid red",
        margin: theme.spacing(1),
      }
    }));

export default Dice;

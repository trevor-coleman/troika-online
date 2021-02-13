import React, { FunctionComponent, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Select, MenuItem,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Casino } from '@material-ui/icons';
import {WeaponTableRow, WeaponTableHeader } from './WeaponTableRow';
import { useFirebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import { CharacterContext } from '../../views/CharacterContext';
import { useTypedSelector } from '../../store';
import Grid from '@material-ui/core/Grid';
import WeaponCard from './WeaponCard';

interface IWeaponsProps {}

type WeaponsProps = IWeaponsProps;

export interface WeaponsState {
  weapons: string[]
}

const CharacterWeapons: FunctionComponent<IWeaponsProps> = (props: IWeaponsProps) => {
  const {} = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext)

  useFirebaseConnect([{
    path: `/characters/${character}/weapons`, storeAs: `/weapons/${character}/weapons`
  }])

  const {weapons=[]} = useTypedSelector(state => state.firebase.data?.weapons?.[character]) ?? {}
  console.log(weapons);

  return (
      isLoaded(weapons) && !isEmpty(weapons) ? <div className={classes.root}>
        <Typography variant={"h5"}>
          Weapons </Typography>
        <Grid container>
          {weapons.map(weapon => <Grid key={weapon} item xs={12}><WeaponCard
              weapon={weapon} /></Grid>)
          }</Grid>
      </div> : <div/>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        backgroundColor: theme.palette.background.paper,
        padding:theme.spacing(2),
      },
    }));

export default CharacterWeapons;

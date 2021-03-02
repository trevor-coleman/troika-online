import React, { FunctionComponent, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { useTypedSelector } from '../../store';
import Grid from '@material-ui/core/Grid';
import WeaponCard from './WeaponCard';
import Button from '@material-ui/core/Button';

interface IWeaponsProps {}

type WeaponsProps = IWeaponsProps;

export interface WeaponsState {
  weapons: string[]
}

const CharacterWeapons: FunctionComponent<IWeaponsProps> = (props: IWeaponsProps) => {
  const {} = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);

  useFirebaseConnect([
                       {
                         path: `/characters/${character}/weapons`,
                         storeAs: `/weapons/${character}/weapons`,
                       },
                     ]);

  const {weapons = []} = useTypedSelector(state => state.firebase.data?.weapons?.[character]) ??
                         {};
  console.log(weapons);

  return (
      <Grid container className={classes.root}>
        {isLoaded(weapons) && !isEmpty(weapons)
         ? weapons.map(weapon => (
                <Grid
                    key={weapon}
                    item
                    xs={12}>
                  <WeaponCard
                      weapon={weapon} />
                </Grid>))
         : <div />}
      </Grid>)
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        backgroundColor: theme.palette.background.paper,
        paddingLeft: theme.spacing(2),
      },
    }));

export default CharacterWeapons;

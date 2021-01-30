import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import GameListItem from './GameListItem';

interface GamesProps {
}

//COMPONENT
const Games: FunctionComponent<GamesProps> = (props: GamesProps) => {
  const {} = props;
  const classes = useStyles();
  const firebase = useFirebase();

  const auth = useTypedSelector(state => state.firebase.auth);
  const profile = useTypedSelector(state => state.firebase.profile);

  const games = profile.games ?? {};

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Games</Typography>
          <List>
            {Object.keys(games)
                   .map(item => (
                       <GameListItem key={item} gameKey={item} />))}
          </List>
        </Box></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Games;

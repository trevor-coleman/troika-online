import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import {
  Paper, ListItem, ListItemText, TextField, GridList,
} from '@material-ui/core';
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
  const [gameId, setGameId] = useState("");
  const [gameError, setGameError] = useState("");

  const games = profile.games ?? {};

  async function addGame() {
    const game = await firebase.ref(`/games/${gameId}`).once('value')
    if(!game.val() || !gameId) {
      setGameError("Game Not Found");
      setGameId("")
      return;
    }
    await firebase.ref(`/profiles/${auth.uid}/games/${gameId}`).set(true)

  }

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Games</Typography>
              <TextField
                size={"small"}
                variant={'outlined'}
                placeholder={"Game Id"}
                onChange={(e)=>{setGameId(e.target.value)}}
            />
              {gameError ? <Typography color={"error"}>Game Not Found</Typography> : ""}
            <Button
                variant={'contained'}
                onClick={addGame}
                color={'primary'}>Add Game by ID</Button>

          <List>
            {isLoaded(profile)
             ? Object.keys(games)
                     .map(item => (
                         <GameListItem
                             key={item}
                             gameKey={item} />))
             : <ListItem>
               <ListItemText primary={"Loading..."} />
            </ListItem>}
          </List>
        </Box>
      </Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Games;

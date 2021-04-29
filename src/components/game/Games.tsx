import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import {
  Paper,
  ListItem,
  ListItemText,
  TextField,
  GridList,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Card,
  CardContent,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { Game } from '../../store/Schema';
import CreateGameDialog from './CreateGameDialog';
import GameCard from './GameCard';

import GameListItem from './GameListItem';

interface GamesProps {
}

//COMPONENT

const Games: FunctionComponent<GamesProps> = (props: GamesProps) => {
  const {} = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const history = useHistory();

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const auth = useTypedSelector(state => state.firebase.auth);
  const profile = useTypedSelector(state => state.firebase.profile);
  const [gameId, setGameId] = useState("");
  const [gameError, setGameError] = useState("");
  const games = profile.games ?? {};

  async function addGame() {
    console.log("addGame", gameId);
    const gameSnap = await firebase.ref(`/games`)
                                   .orderByChild('slug')
                                   .equalTo(gameId)
                                   .limitToFirst(1)
                                   .once('value');

    const result: Game = gameSnap.val();

    if (!result) {
      setGameError("Game Not Found");
      setGameId("");
      return;
    }

    const gameKey: string | null = Object.keys(gameSnap.val())[0];
    const game = result[gameKey];

    if (game.players[auth.uid] === true) {
      setGameError(`You are already in this game.`);
      return;
    }

    try {
      await firebase.ref(`/profiles/${auth.uid}/games/${gameKey}`)
                    .set(true);

      await firebase.ref(`/games/${gameKey}/players/${auth.uid}`)
                    .set(true);
    } catch (e) {
      setGameError(e.message);
      return;
    }

    onCloseJoinDialog();

    history.push(`/game/${gameKey}`);

  }

  const onCloseJoinDialog = () => {
    setGameId("");
    setJoinDialogOpen(false);
  };
  const onCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  return (

      <Box p={2}>
        <Typography variant={'h5'}>Games</Typography>
        <Divider/>
        <Grid container>
          <Grid
              item
              xs={12}>
            <Box py={2}>
              <Button
                  variant={'contained'}
                  onClick={() => setCreateDialogOpen(true)}
              >
                Create New Game
              </Button>
              {` `}
              <Button
                  variant={'contained'}
                  onClick={() => setJoinDialogOpen(true)}
              >Join Game by ID</Button>
            </Box>
          </Grid>

          <Grid
              item
              xs={12}
              container
              spacing={2}>
            {isLoaded(profile)
             ? Object.keys(games)
                     .map(item => (
                         <Grid
                             item
                             xs={6}
                             key={`gameCard-${item}`}>
                           <GameCard
                               gameKey={item} />
                         </Grid>))
             : <Card>
               <CardContent>Loading...</CardContent>
             </Card>}
          </Grid>
        </Grid>

        <Dialog
            maxWidth={'xs'}
            fullWidth
            open={joinDialogOpen}
            onClose={onCloseJoinDialog}>
          <DialogTitle>Join Game</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid
                  item
                  xs={12}>
                <TextField
                    size={"small"}
                    error={Boolean(gameError)}
                    fullWidth
                    variant={'outlined'}
                    label={"Enter Game ID"}
                    placeholder={"my-troika-game#afed"}
                    onChange={(e) => {
                      setGameError("");
                      setGameId(e.target.value);
                    }}
                />{` `}</Grid>
              <Grid
                  item
                  xs={12}>
                <div className={classes.errorMessage}>
                  <Typography color={"error"}>{gameError
                                               ? "Game Not Found"
                                               : ` `}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onCloseJoinDialog()}>Cancel</Button>
            <Button
                onClick={addGame}
                color={'primary'}>Join</Button>
          </DialogActions>

        </Dialog>
        <CreateGameDialog
            open={createDialogOpen}
            onClose={onCloseCreateDialog} />

      </Box>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root        : {},
      errorMessage: {
        height     : theme.typography.body1.minHeight,
        borderWidth: 2,
        borderColor: 'red',
      },
    }));

export default Games;

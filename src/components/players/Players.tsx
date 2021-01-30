import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ProfileListItem from '../profile/ProfileListItem';
import { Paper, Dialog, DialogTitle } from '@material-ui/core';
import {
  usePlayers, useProfile, useAuth, useGame, useGameRef,
} from '../../store/selectors';
import Button from '@material-ui/core/Button';
import { useFirebase, firebaseConnect } from 'react-redux-firebase';
import { Game } from '../../store/Schema';
import { useTypedSelector, RootState } from '../../store';

interface PlayersProps {
  gameKey: string;
}

//COMPONENT
const Players: FunctionComponent<PlayersProps> = (props: PlayersProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const firebase = useFirebase();
  const profile = useProfile();
  const auth = useAuth();
  const game = useGame(gameKey);
  const players = game?.players;
  const invited = game?.invited;
  const gameRef= useGameRef(gameKey);
  const [dialogOpen, setDialogOpen] = useState(false);

  const friends = profile.friends ?? {};

  firebaseConnect({path: `/games/${gameKey}`});


  const handleClose = () => {
    setDialogOpen(false);
  }

  const inviteFriend = async (friend: string) => {
    await Promise.all([
      gameRef.child(`invited/${friend}`).set(true),
      firebase.ref(`/profiles/${friend}`)
              .child(`invitations/${gameKey}`)
              .set(true),
    ]);
  };

  const InviteButton: FunctionComponent<PropsWithChildren<{ profileKey: string }>> = ({profileKey}: PropsWithChildren<{ profileKey: string }>) => {

    let alreadyInvited:boolean = game && game.invited ? game.invited[profileKey] : false;

    return (
        <Button
            disabled={alreadyInvited}
            variant={"outlined"}
                color={"primary"}
                onClick={() => inviteFriend(profileKey)}>{alreadyInvited ? "Invited" : "Invite"}</Button>);
  };

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Players</Typography>
          <Button onClick={() => setDialogOpen(true)}>Add Player</Button>
          <List>
            {players
             ? Object.keys(players)
                     .map(item => (
                         <ProfileListItem key={item} profileKey={item} />))
             : ""}
          </List>
          <Typography variant={'h5'}>Invited</Typography>
          <List>
            {invited
             ? Object.keys(invited)
                     .map(item => (
                         <ProfileListItem key={item} profileKey={item} />))
             : ""}
          </List>
        </Box>
        <Dialog open={dialogOpen} onClose={handleClose}>
          <DialogTitle>Select Player to Invite</DialogTitle>
          <List>
            {Object.keys(friends)
                   .map(item => (
                       <ProfileListItem key={item}
                                        profileKey={item}
                                        firstAction={
                                          <InviteButton profileKey={item} />} />))}
          </List>
        </Dialog></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Players;

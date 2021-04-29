import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { Paper, ListItem, ListItemText } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import GameListItem from './GameListItem';
import Button from '@material-ui/core/Button';

interface GamesProps {
}

//COMPONENT

const Games: FunctionComponent<GamesProps> = (props: GamesProps) => {
  const {} = props;
  const classes = useStyles();
  const firebase = useFirebase();

  const auth = useTypedSelector(state => state.firebase.auth);
  const profile = useTypedSelector(state => state.firebase.profile);

  const acceptInvitation = async (gameKey: string) => {
    await Promise.all([
      firebase.ref(`/games/${gameKey}`)
              .child(`players/${auth.uid}`)
              .set(true),
      firebase.ref(`/games/${gameKey}`)
              .child(`invited/${auth.uid}`)
              .set(null),
      firebase.ref(`/profiles/${auth.uid}`)
              .child(`games/${gameKey}`)
              .set(true),
      firebase.ref(`/profiles/${auth.uid}`)
              .child(`invitations/${gameKey}`)
              .set(null),
    ]);
  };

  const InviteButton: FunctionComponent<PropsWithChildren<{ gameKey: string }>> = ({gameKey}: PropsWithChildren<{ gameKey: string }>) => {
    return (
        <Button
            variant={"outlined"}
            color={"primary"}
            onClick={() => acceptInvitation(gameKey)}>{"Accept"}</Button>);
  };

  const invitations = profile.invitations;

  return (
      !isLoaded(invitations) || isEmpty(invitations) || !invitations
      ? <div />
      : <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Game Invitations</Typography>
          <List>
            {isLoaded(profile)
             ? isEmpty(invitations)
               ? <ListItem><ListItemText primary={"None"} /></ListItem>
               : Object.keys(invitations)
                       .map(item => (
                           <GameListItem
                               key={item}
                               gameKey={item}
                               firstAction={<InviteButton gameKey={item} />}
                           />))
             : <ListItem><ListItemText primary={"Loading..."} /></ListItem>}
          </List>
        </Box></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Games;

import IconButton from '@material-ui/core/IconButton';
import { Person, PersonAdd } from '@material-ui/icons';
import React, {
  ChangeEvent, FunctionComponent, PropsWithChildren, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { useTypedSelector } from '../../store';
import ProfileListItem from '../profile/ProfileListItem';
import {
  Paper,
  Dialog,
  DialogTitle,
  ListItem,
  ListItemSecondaryAction,
  CardContent,
  DialogContent,
  DialogActions,
  ListItemText,
  TextField,
  ListItemAvatar,
  Avatar,
  Collapse,
} from '@material-ui/core';
import {
  useProfile, useAuth, useGame, useGameRef,
} from '../../store/selectors';
import Button from '@material-ui/core/Button';
import {
  useFirebase, useFirebaseConnect, isLoaded, isEmpty,
} from 'react-redux-firebase';

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
  const gameRef = useGameRef(gameKey);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);

  const friends = profile.friends ?? {};

  const [addFriend, setAddFriend] = useState(true);
  const [emailSearch, setEmailSearch] = useState("");

  useFirebaseConnect({path: `/games/${gameKey}`});
  useFirebaseConnect({
    path       : '/profiles',
    queryParams: ["orderByChild=email", `equalTo=${emailSearch}`],
    storeAs    : `/addPlayersSearchResult`,
  });

  const resultProfile = useTypedSelector(state => state.firebase.ordered?.addPlayersSearchResult);

  console.log(resultProfile);

  const handleClose = () => {
    setAddFriendDialogOpen(false);
  };

  const invitePlayer = async (friend: string) => {
    await Promise.all([
      gameRef.child(`invited/${friend}`)
             .set(true), firebase.ref(`/profiles/${friend}`)
                                 .child(`invitations/${gameKey}`)
                                 .set(true),
    ]);
  };

  const InviteButton: FunctionComponent<PropsWithChildren<{ profileKey: string }>> = ({profileKey}: PropsWithChildren<{ profileKey: string }>) => {

    let alreadyInvited: boolean = game && game.invited
                                  ? game.invited[profileKey]
                                  : false;
    let alreadyInGame: boolean = game && game.players
                                 ? game.players[profileKey]
                                 : false;

    return (
        <Button
            disabled={alreadyInvited || alreadyInGame}
            variant={"outlined"}
            color={"primary"}
            onClick={() => invitePlayer(profileKey)}>{alreadyInvited
                                                      ? "Invited"
                                                      : alreadyInGame
                                                        ? "Accepted"
                                                        : "Invite"}</Button>);
  };

  function handleSearchChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setEmailSearch(e.target.value ?? "");
  }

  function addPlayerToGame(playerToAdd: string): void {
    invitePlayer(playerToAdd);
  }

  const disableAddFriend = isEmpty(resultProfile) || !isLoaded(resultProfile)

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Players</Typography>
          <List>
            {isLoaded(players)
             ? Object.keys(players)
                     .map(item => (
                         <ProfileListItem
                             isOwner={game?.owner === item}
                             key={item}
                             profileKey={item} />))
             : ""}
          </List>
          {game?.owner && auth.uid == game?.owner
           ? <Button
               color={"primary"}
               variant={'contained'}
               onClick={() => setAddFriendDialogOpen(true)}>Add
                                                            Player</Button>
           : ""}
        </Box>
        {invited
         ? <Box p={2}>
           <Typography variant={'h5'}>Invited</Typography>
           <List>
             {invited
              ? Object.keys(invited)
                      .map(item => (
                          <ProfileListItem
                              key={item}
                              profileKey={item} />))
              : ""}
           </List>
         </Box>
         : ""}
        <Dialog
            maxWidth={'xs'}
            fullWidth
            open={addFriendDialogOpen}
            onClose={handleClose}>
          <DialogTitle>{addFriend
                        ? "Add From Friends List"
                        : "Add User By Email"}</DialogTitle>
          <DialogContent>
            {addFriend
             ? <>
               <List>
                 {isLoaded(friends) && isEmpty(friends)
                  ? <ListItem
                      button
                      disabled><ListItemText primary={'No friends to add.'} /></ListItem>
                  : <div>{Object.keys(friends)
                                .map(item => {
                                  console.log("friend item ->", item);
                                  return (
                                      <ProfileListItem
                                          key={item}
                                          profileKey={item}
                                          firstAction={
                                            <InviteButton profileKey={item} />} />);
                                })}</div>}
               </List></>
             : <>
               <TextField
                   fullWidth
                   label={"Search by Email"}
                   type={'email'}
                   value={emailSearch}
                   placeholder={"yourfriend@email.com"}
                   variant={"outlined"}
                   onChange={handleSearchChange} />
               <Collapse in={emailSearch.length > 0}>
                 <List>
                   {isLoaded(resultProfile)
                    ? !isEmpty(resultProfile)
                      ? <ListItem
                          button
                          onClick={() => addPlayerToGame(resultProfile[0].key)}>
                        <ListItemAvatar><Avatar className={classes.addPerson}><PersonAdd /></Avatar></ListItemAvatar>
                        <ListItemText primary={resultProfile?.[0]?.value?.name ?? "Anonymous User"} />
                      </ListItem>
                      : <ListItem disabled>
                        <ListItemText primary={'No user found with that address'} />
                      </ListItem>
                    : <ListItem disabled>
                      <ListItemText primary={'Loading'} />
                    </ListItem>}
                 </List>
               </Collapse>
             </>}
          </DialogContent>
          <DialogActions><Button onClick={() => setAddFriend(!addFriend)}>{addFriend
                                                                           ? "Add user by email"
                                                                           : "Add From Friends List"}</Button><Button onClick={handleClose}>Cancel</Button></DialogActions>
        </Dialog></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root     : {},
      addPerson: {backgroundColor: theme.palette.primary.main},
    }));

export default Players;

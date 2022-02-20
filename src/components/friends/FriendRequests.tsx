import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import List from '@material-ui/core/List';
import ProfileListItem from '../profile/ProfileListItem';

interface FriendRequestsProps {
}

//COMPONENT
const FriendRequests: FunctionComponent<FriendRequestsProps> = (props: FriendRequestsProps) => {
  const {} = props;
  const classes = useStyles();
  useDispatch();
    const firebase = useFirebase();

  const auth = useTypedSelector(state => state.firebase.auth);
  useTypedSelector(state => state.firebase.profile);

    const requests = useTypedSelector(state => (
      {
        sent: state.firebase.profile.sentRequests,
        received: state.firebase.profile.receivedRequests,
      }));

  const acceptRequest = async (key: string) => {
    await Promise.all([
      firebase.ref(`/profiles/${auth.uid}/friends/${key}`)
              .set(true), firebase.ref(`/profiles/${key}/friends/${auth.uid}`)
                                  .set(true),
    ]);

    await Promise.all([
      firebase.ref(`/profiles/${auth.uid}/receivedRequests/${key}`)
              .set(null),
      firebase.ref(`/profiles/${key}/sentRequests/${auth.uid}`)
              .set(null),
    ]);
  };

  const cancelRequest = async (key: string) => {
    await Promise.all([
      firebase.ref(`/profiles/${auth.uid}/sentRequests/${key}`)
              .set(null),
      firebase.ref(`/profiles/${key}/receivedRequests/${auth.uid}`)
              .set(null),
    ]);

  };

  const AcceptButton: FunctionComponent<PropsWithChildren<{ profileKey: string }>> = ({profileKey}: PropsWithChildren<{ profileKey: string }>) =>
      <Button variant={"outlined"}
              color={"primary"}
              onClick={() => acceptRequest(profileKey)}>Accept</Button>;
  const CancelButton: FunctionComponent<PropsWithChildren<{ profileKey: string }>> = ({profileKey}: PropsWithChildren<{ profileKey: string }>) =>
      <Button variant={"outlined"}
              color={"secondary"}
              onClick={() => cancelRequest(profileKey)}>Cancel</Button>;

  let showSentRequests: boolean = isLoaded(requests.sent) && Object.keys(requests.sent).length > 0;
  let showReceivedRequests: boolean = isLoaded(requests.received) &&
                   Object.keys(requests.received).length > 0;
  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Friend Requests</Typography>
          {isLoaded(requests.sent) || isLoaded(requests.received)
           ? <React.Fragment>
             {showSentRequests
              ? <React.Fragment>
                <Typography variant={'subtitle2'}>Sent</Typography>
                <List>
                  {Object.keys(requests.sent)
                         .map(item => (
                             <ProfileListItem key={item}
                                              profileKey={item}
                                              firstAction={<CancelButton
                                                  profileKey={item} />} />))}
                </List></React.Fragment>
              : ""}

             {showReceivedRequests
              ? <React.Fragment>
                <Typography variant={'subtitle2'}>Received</Typography>
                <List>
                  {Object.keys(requests.received)
                         .map(item => (
                             <ProfileListItem key={item}
                                              profileKey={item}
                                              firstAction={<AcceptButton
                                                  profileKey={item} />} />))}
                </List></React.Fragment>
              : ""}

           </React.Fragment>
           : <div><Typography className={classes.none}>None</Typography></div>}

        </Box></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      none: {
        margin: theme.spacing(2),
        color: theme.palette.grey['400'],
      },
    }));

export default FriendRequests;

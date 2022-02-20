import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Paper, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';

interface AddFriendProps {
}

//COMPONENT
const AddFriend: FunctionComponent<AddFriendProps> = (props: AddFriendProps) => {
  const {} = props;
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const firebase = useFirebase();
  let error = "";

  const auth = useTypedSelector(state => state.firebase.auth);

  const userKey = auth.uid;

  useFirebaseConnect({
    path: 'profiles',
    storeAs: 'addFriendResult',
    queryParams: ['orderByChild=email', `equalTo=${email}`],
  });
  useFirebaseConnect({path: `/profiles/${userKey}/sentRequests`});

  const result = useTypedSelector(state => state.firebase.ordered.addFriendResult);
  const sentRequests = useTypedSelector(state => {
    return state.firebase.profile.sentRequests &&
           state.firebase.profile.sentRequests
           ? state.firebase.profile.sentRequests
           : {};
  });
  const friends = useTypedSelector(state => {
    return state.firebase.profile.friends &&
           state.firebase.profile.friends
           ? state.firebase.profile.friends
           : {};
  });

  const friendKey = result
                    ? Object.keys(result)[0]
                    : "";

  const isError = email.length == 0 || result === null || email == auth.email ||
                  sentRequests[friendKey] || friends[friendKey];

  if (email.length > 0 && result === null) {
    error = "User not found";
  }

  if (email === auth.email) {
    error = "Can't add self as friend";
  }

  if (sentRequests[friendKey]) {
    error = "Already requested";
  }

  if (friends[friendKey]) {
    error = "Already friends";
  }

  const addFriend = async () => {
    await firebase.ref(`/profiles/${userKey}/sentRequests/${friendKey}`)
                  .set(true);
    await firebase.ref(`/profiles/${friendKey}/receivedRequests/${userKey}`)
                  .set(true);
    setSuccess(true);
    setEmail("");
  };

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Add Friend</Typography>
          <TextField value={email}
                     placeholder={"friend@email.com"}
                     type={"email"}
                     error={error !== ""}
                     label={error
                            ? error
                            : "email"}
                     onChange={(e) => {
                       setSuccess(false);
                       setEmail(e.target.value);
                     }}
                     className={classes.input} />
          <Button disabled={isError}
                  onClick={addFriend}
                  className={classes.button}
                  variant={"contained"}
                  color={"primary"}>Add Friend</Button>
          <div>{success
                ? <Typography>Sent friend request</Typography>
                : ""}</div>
        </Box></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {flexGrow: 1},
      input: {width: "100%"},
      button: {marginTop: theme.spacing(1)},
    }));

export default AddFriend;

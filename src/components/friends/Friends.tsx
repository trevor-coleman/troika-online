import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import List from '@material-ui/core/List';
import ProfileListItem from '../profile/ProfileListItem';

interface FriendsProps {
}

//COMPONENT
const Friends: FunctionComponent<FriendsProps> = (props: FriendsProps) => {
  const {} = props;
  const classes = useStyles();
  const firebase = useFirebase();

  const auth = useTypedSelector(state => state.firebase.auth);
  const profile = useTypedSelector(state => state.firebase.profile);

  const friends = profile.friends ?? {};

  const removeFriend = async (key: string) => {
    await Promise.all([
      firebase.ref(`/profiles/${auth.uid}/friends/${key}`)
              .set(null), firebase.ref(`/profiles/${key}/friends/${auth.uid}`)
                                  .set(null),
    ]);
  };

  const RemoveButton: FunctionComponent<PropsWithChildren<{ profileKey: string }>> = ({profileKey}: PropsWithChildren<{ profileKey: string }>) =>
      <Button variant={"outlined"}
              color={"secondary"}
              onClick={() => removeFriend(profileKey)}>Remove</Button>;

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Friends</Typography>
          <List>
            {Object.keys(friends)
                   .map(item => (
                       <ProfileListItem key={item}
                                        profileKey={item}
                                        firstAction={
                                          <RemoveButton profileKey={item} />} />))}
          </List>
        </Box></Paper>);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default Friends;

import React, {
  FunctionComponent,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  ListItemText, ListItem, ListItemSecondaryAction, ListItemAvatar, Avatar,
} from '@material-ui/core';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { useAuth } from '../../store/selectors';
import FlagIcon from '@material-ui/icons/Flag';
import PersonIcon from '@material-ui/icons/Person';

interface ProfileListItemProps {
  profileKey:string;
  firstAction?: JSX.Element;
  isOwner?: boolean;
}

//COMPONENT
const ProfileListItem: FunctionComponent<ProfileListItemProps> = (props: ProfileListItemProps) => {
  const {
    isOwner,
    profileKey,
    firstAction
  } = props;
  const classes = useStyles(props);
  useDispatch();

    useFirebaseConnect({path: `/profiles/${profileKey}`});
  useAuth();
    const profile = useTypedSelector(state => (state.firebase.data.profiles && state.firebase.data.profiles[profileKey]) ? state.firebase.data.profiles[profileKey] :{})
  return (
      <ListItem>
        <ListItemAvatar><Avatar className={classes.avatar}>{isOwner ? <FlagIcon/>:<PersonIcon/>}</Avatar></ListItemAvatar>
        <ListItemText primary={`${profile?.name ?? profile.email ?? "Anonymous User"}${isOwner? ' (owner)':''}`} />{firstAction
                                                        ?
                                                        <ListItemSecondaryAction>
                                                                 {firstAction}
                                                        </ListItemSecondaryAction>
                                                        : ""}
      </ListItem>);
}


const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      avatar: {
        backgroundColor: ({isOwner}:ProfileListItemProps) => isOwner
                                                             ? theme.palette.secondary.light
                                                             : theme.palette.primary.light
      }
    }));

export default ProfileListItem;

import React, {
  FunctionComponent,
  Component,
  PropsWithChildren, ComponentType,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  ListItemText,
  ListItem, ListItemSecondaryAction,
} from '@material-ui/core';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { useAuth } from '../../store/selectors';

interface ProfileListItemProps {
  profileKey:string;
  firstAction?: JSX.Element
}

//COMPONENT
const ProfileListItem: FunctionComponent<ProfileListItemProps> = (props: ProfileListItemProps) => {
  const {
    profileKey,
    firstAction
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useFirebaseConnect({path: `/profiles/${profileKey}`});
  const auth = useAuth()
  const profile = useTypedSelector(state => (state.firebase.data.profiles && state.firebase.data.profiles[profileKey]) ? state.firebase.data.profiles[profileKey] :{})
  return (
      <ListItem>
        <ListItemText primary={profile?.name ?? profile.email ?? "Anonymous User"} />{firstAction
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
    }));

export default ProfileListItem;

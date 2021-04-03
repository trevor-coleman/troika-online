import React, {
  FunctionComponent,
  Component,
  PropsWithChildren,
  ComponentType,
  useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  ListItemText, ListItem, ListItemSecondaryAction, ListItemAvatar, Avatar,
} from '@material-ui/core';
import {
  useFirebaseConnect,
  isLoaded, useFirebase,
} from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { useHistory } from 'react-router-dom';

interface CharacterListItemProps {
  characterKey:string;
  firstAction?: JSX.Element

}

//COMPONENT
const CharacterListItem: FunctionComponent<CharacterListItemProps> = (props: CharacterListItemProps) => {
  const {
    characterKey,
    firstAction
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history=useHistory();
  const firebase=useFirebase();

  useFirebaseConnect({path: `/characters/${characterKey}`});
  const character = useTypedSelector(state => state.firebase.data?.characters?.[characterKey] ?? {name:"", portrait:""});

  const [portraitUrl, setPortraitURL] = useState("");

  useEffect(()=>{
    getPortrait()
  })

  async function getPortrait() {
    setPortraitURL(character?.portrait
                   ? await firebase.storage()
                                   .ref(character?.portrait)
                                   .getDownloadURL()
                   : portraitUrl);
  }

  return (
      isLoaded(character) ?
      <ListItem className={classes.root} button onClick={()=>history.push(`/character/${characterKey}/edit`)}>
        <ListItemAvatar>
          <Avatar src={portraitUrl}>{character.name.slice(0,1)}</Avatar>
        </ListItemAvatar>
      <ListItemText primary={character?.name ?? ""} />{firstAction
                                                        ?
                                                        <ListItemSecondaryAction>
                                                                 {firstAction}
                                                        </ListItemSecondaryAction>
                                                        : ""}
      </ListItem> : <ListItem/>);
}


const useStyles = makeStyles((theme: Theme) => (
    {
      root: {borderBottomWidth: 1, borderColor: theme.palette.divider, borderStyle:"solid"},
    }));

export default CharacterListItem;

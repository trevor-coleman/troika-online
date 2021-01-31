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
import { useFirebaseConnect, isLoaded } from 'react-redux-firebase';
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

  useFirebaseConnect({path: `/characters/${characterKey}`});
  const character = useTypedSelector(state => state.firebase.data.characters && state.firebase.data.characters[characterKey] ? state.firebase.data.characters[characterKey] : {name:""});

  return (
      isLoaded(character) ?
      <ListItem button onClick={()=>history.push(`/character/${characterKey}/edit`)}><ListItemText primary={character?.name ?? ""} />{firstAction
                                                        ?
                                                        <ListItemSecondaryAction>
                                                                 {firstAction}
                                                        </ListItemSecondaryAction>
                                                        : ""}
      </ListItem> : <ListItem/>);
}


const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterListItem;

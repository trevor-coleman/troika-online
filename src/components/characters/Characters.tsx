import React, { FunctionComponent, useEffect, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { TextField, Paper, ListItem, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {
  useFirebaseConnect,
  useFirebase, isLoaded,
} from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import List from '@material-ui/core/List';
import ProfileListItem from '../profile/ProfileListItem';
import { useGame, useGameRef } from '../../store/selectors';
import { Character } from '../../store/Schema';
import { useHistory } from 'react-router-dom';
import CharacterListItem from './CharacterListItem';

interface CharactersProps {
  gameKey: string
}

//COMPONENT
const Characters: FunctionComponent<CharactersProps> = (props: CharactersProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const firebase = useFirebase();

  const auth = useTypedSelector(state => state.firebase.auth);
  const history=useHistory();
  const game = useGame(gameKey);
  const gameRef = useGameRef(gameKey);
  const characters = game?.characters;


  const createCharacter = async () => {

    const name = game?.owner === auth.uid ?
                 "New NPC" : `${auth.displayName}'s New Character`;
    const sort_name = name.toLowerCase();

    const character:Partial<Character> = {
      game: gameKey,
      owner: auth.uid,
      name,
      sort_name
    }

    const newCharacterRef = await firebase.ref('/characters').push(character);
    await gameRef.child(`characters/${newCharacterRef.key}`).set(true)
    history.push(`/character/${newCharacterRef.key}/new`)

  };

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Characters</Typography>
          <List>
            {isLoaded(characters) ? Object.keys(characters)
                   .map(item => (
                       <CharacterListItem key={item}
                                        characterKey={item} />)) : <ListItem/>}
          </List>
          <Button color={'primary'} onClick={createCharacter}>Create Character</Button>
        </Box></Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Characters;

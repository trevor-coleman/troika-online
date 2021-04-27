import Grid from '@material-ui/core/Grid';
import React, {
  FunctionComponent, useEffect, PropsWithChildren, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { TextField, Paper, ListItem, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {
  useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import List from '@material-ui/core/List';
import ProfileListItem from '../profile/ProfileListItem';
import {
  useAuth, useGame, useGameRef, useProfile,
} from '../../store/selectors';
import { Character } from '../../store/Schema';
import { useHistory } from 'react-router-dom';
import CharacterListItem from './CharacterListItem';
import * as NameGen from "../../utils/namegen";

interface CharactersProps {
  gameKey: string
}

const generator = new NameGen.Generator('Bvss Bvss')

//COMPONENT
const Characters: FunctionComponent<CharactersProps> = (props: CharactersProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();

  useFirebaseConnect([`/games/${gameKey}`, `/profiles/${auth.uid}`]);
  const [editing, setEditing] = useState(false);

  const history = useHistory();
  const game = useGame(gameKey);
  const gameRef = useGameRef(gameKey);
  const characters = game?.characters;

  const profile = useProfile();
  const toggleEdit = () => {setEditing(!editing);};

  function toTitleCase(str:string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0)
                .toUpperCase() + txt.substr(1)
                                    .toLowerCase();
    });
  }

  const createCharacter = async () => {

    const name = toTitleCase(generator.toString());
    const sort_name = name.toLowerCase();

    const character: Partial<Character> = {
      game : gameKey,
      owner: auth.uid,
      name,
      sort_name,
    };

    const newCharacterRef = await firebase.ref('/characters')
                                          .push(character);
    await gameRef.child(`characters/${newCharacterRef.key}`)
                 .set(true);
    history.push(`/character/${newCharacterRef.key}/new`);

  };

  const removeCharacter = async (characterKey: string) => {
    await gameRef.child('characters')
                 .child(characterKey)
                 .remove();
    await firebase.ref(`/skills/${characterKey}`)
                  .set(null)
                  .catch(e => console.log("error deleting skills", e));
    await firebase.ref(`/items/${characterKey}`)
                  .set(null)
                  .catch(e => console.log("error deleting items", e));
    await firebase.ref(`/skillValues/${characterKey}`)
                  .set(null)
                  .catch(e => console.log("error deleting skillValues", e));
    await firebase.ref(`/rolls/${characterKey}`)
                  .set(null)
                  .catch(e => console.log("error deleting rolls", e));
    await firebase.ref(`/characters/${characterKey}`)
                  .set(null)
                  .catch(e => console.log("error deleting character", e));

  };

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Typography variant={'h5'}>Characters</Typography>
          <List>
            {isLoaded(characters)
             ? Object.keys(characters)
                     .map(item => (
                         <CharacterListItem
                             key={item}
                             onRemoveCharacter={removeCharacter}
                             characterKey={item}
                             editing={editing} />))
             : <ListItem />}
          </List>
          <div className={classes.buttonRow}>
            {editing
             ? <Button
                 color={'secondary'}
                 variant={'contained'}
                 onClick={toggleEdit}>Stop
                                      Editing</Button>
             : <>
               <Button
                   variant={'contained'}
                   disabled={!isLoaded(characters) || Object.keys(characters).length === 0}
                   className={classes.buttonRowButton}
                   onClick={toggleEdit}>
                 Edit List
               </Button> {` `}
               <Button
                   color={'primary'}
                   className={classes.buttonRowButton}
                   variant={'contained'}
                   onClick={createCharacter}>
                 Create Character
               </Button>
             </>}
          </div>
        </Box>
      </Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root     : {},
      buttonRow: {
        display       : 'flex',
        alignItems    : 'flex-end',
        justifyContent: 'flex-end',
        flexDirection : 'row',

      },
      buttonRowButton: {
        marginRight: theme.spacing(1)
      }
    }));

export default Characters;

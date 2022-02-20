import React, {
    FunctionComponent, useState,
} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {Paper, ListItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {
    useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import List from '@material-ui/core/List';
import {
    useAuth, useGame, useGameRef, useProfile,
} from '../../store/selectors';
import {Bio, Character} from '../../store/Schema';
import {useHistory} from 'react-router-dom';
import CharacterListItem from './CharacterListItem';
import Collapse from '@material-ui/core/Collapse';

interface CharactersProps {
    gameKey: string
}

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
    const toggleEdit = () => {
        setEditing(!editing);
    };

    const createCharacter = async () => {

        const name = `${profile.name}'s New Character`;
        const sort_name = name.toLowerCase();

        const character: Partial<Character> = {
            game: gameKey,
            owner: auth.uid,
            sort_name,
        };

        const bio: Partial<Bio> = {
            name,
        }

        const newCharacterRef = await firebase.ref('/characters')
            .push(character);

        const bioPromise = firebase.ref(`/bios/${character}`).push(bio);
        const gamePromise = gameRef.child(`characters/${newCharacterRef.key}`)
            .set(true);

        await Promise.all([bioPromise, gamePromise])
        history.push(`/character/${newCharacterRef.key}/new`);

    };

    const removeCharacter = async (characterKey: string) => {

        //remove character from game
        await gameRef.child('characters')
            .child(characterKey)
            .remove();
        //remove character data
        await firebase.ref(`/skills/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting skills", e));
        await firebase.ref(`/bios/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting bio", e));
        await firebase.ref(`/baseStats/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting baseStats", e));
        await firebase.ref(`/portraits/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting portraits", e));
        await firebase.ref(`/moniesAndProvisions/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting moniesAndProvisions", e));
        await firebase.ref(`/items/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting items", e));
        await firebase.ref(`/skillValues/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting skillValues", e));
        await firebase.ref(`/rolls/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting rolls", e));
        //remove character
        await firebase.ref(`/characters/${characterKey}`)
            .set(null)
            .catch(e => console.error("error deleting character", e));

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
                                    editing={editing}/>))
                        : <ListItem/>}
                </List>
                <Collapse in={editing}>
                    <Typography color={'secondary'}>
                        <b>WARNING: Removing characters cannot be undone.</b>
                    </Typography>
                </Collapse>
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
                                disabled={!isLoaded(characters) ||
                                    Object.keys(characters).length === 0}
                                className={classes.buttonRowButton}
                                onClick={toggleEdit}>
                                Remove Characters
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
        root: {},
        buttonRow: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            flexDirection: 'row',

        },
        buttonRowButton: {
            marginRight: theme.spacing(1),
        },
    }));

export default Characters;

import React, {
  FunctionComponent, useEffect, useState, ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';

import { Link, useParams } from 'react-router-dom';
import { useCharacter } from '../store/selectors';
import Typography from '@material-ui/core/Typography';
import { Character } from '../store/Schema';
import Grid from '@material-ui/core/Grid';
import { blankCharacter } from '../store/templates';
import CharacterSkills from '../components/skills/CharacterSkills';
import Stats from '../components/stats/Stats';
import Bio from '../components/bio/Bio';
import CharacterItems from '../components/items/CharacterItems';

interface CharacterEditorProps {
  init?: boolean
}

//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = (props: CharacterEditorProps) => {
  const {init} = props;
  const {characterKey} = useParams<{ characterKey: string }>();
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect({
    path: `/characters/${characterKey}`,
  });
  const character = useCharacter(characterKey);
  const firebase = useFirebase();

  const [values, setValues] = useState<Partial<Character>>(blankCharacter);

  useEffect(() => {
    if (character) setValues({...blankCharacter, ...character});
  }, [character]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });

    firebase.ref(`/characters/${characterKey}/${e.target.id}`)
            .set(e.target.value);
  }

  return (
      <div>
        <div>
          <Link to={`/game/${character?.game}`}>
            <Typography paragraph>{"<"} Back to Game</Typography></Link>
        </div>

        <div>
          <Typography variant={'h3'}>{values.name}</Typography>
        </div>

        <Grid container
              direction={'column'}
              spacing={4}>
          <Grid container spacing={2}
                item
                xs={12}>
            <Grid item
                  xs={12}>
              <Bio characterKey={characterKey} />
            </Grid>
            <Grid item
                  xs={12}>
              <Stats characterKey={characterKey} />
            </Grid>
          </Grid>
          <Grid container
                spacing={2}
                item
                xs={12}>
          <Grid item
                xs={12}>
            <CharacterSkills characterKey={characterKey}
                             skills={character?.skills} />
          </Grid>
          </Grid>
          <Grid container
                spacing={2}
                item
                xs={12}>
            <Grid item
                  xs={12}>
              <CharacterItems characterKey={characterKey}
                               items={character?.items} />
            </Grid>
          </Grid>
        </Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      statInput: {
        textAlign: "center",
        paddingLeft: "1rem",
      },
    }));

export default CharacterEditor;

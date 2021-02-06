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
import { useTypedSelector } from '../store';

interface CharacterEditorProps {
  init?: boolean
}

//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = (props: CharacterEditorProps) => {
  const {init} = props;
  const {characterKey} = useParams<{ characterKey: string }>();
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect(
     [
         `/characters/${characterKey}/name`,
         `/characters/${characterKey}/game`,
]
  );
  const name = useTypedSelector(state => state.firebase.data?.characters?.[characterKey].name);
  const game = useTypedSelector(state => state.firebase.data?.characters?.[characterKey].name);
  const firebase = useFirebase();

  const [values, setValues] = useState<Partial<Character>>({});

  useEffect(() => {
    if (name) setValues({...values, name});
    if (game) setValues({...values, game});
  }, [name, game]);

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
          <Link to={`/game/${values?.game}`}>
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
            <CharacterSkills characterKey={characterKey} />
          </Grid>
          </Grid>
          <Grid container
                spacing={2}
                item
                xs={12}>
            <Grid item
                  xs={12}>
              <CharacterItems characterKey={characterKey} />
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

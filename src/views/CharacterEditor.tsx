import React, {
  FunctionComponent, useEffect, useState, ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';

import { Link, useParams } from 'react-router-dom';
import { useCharacter } from '../store/selectors';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Character } from '../store/Schema';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { blankCharacter } from '../store/templates';

interface CharacterEditorProps {
  init?: boolean
}


//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = (props: CharacterEditorProps) => {
  const {init} = props;
  const {characterKey} = useParams<{ characterKey: string }>();
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect({path: `/characters/${characterKey}`});
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
          <Link to={`/game/${character?.game}`}> {"<"} Back to Game</Link>
        </div>

        <div>
          <Typography variant={'h3'}>{values.name}</Typography>
        </div>

        <Grid container
              direction={'row'}
              spacing={1}>

          <Grid item
                container
                spacing={1}
                xs={12}
                sm={6}>
            <Paper>
              <Box p={2}>
                <form noValidate
                      autoComplete={"off"}>
                  <Grid container
                        direction={"column"}
                        spacing={2}>
                    <Grid item>
                      <TextField label={"name"}
                                 id={"name"}
                                 value={values.name}
                                 onChange={handleChange} />
                    </Grid>
                    <Grid item>
                      <TextField label={"Background"}
                                 id={"background"}
                                 value={values.background}
                                 onChange={handleChange} />
                    </Grid>
                    <Grid item>
                      <TextField label={"Special"}
                                 id={"special"}
                                 multiline
                                 value={values.special}
                                 onChange={handleChange} />
                    </Grid>
                    <Grid item>
                      <TextField label={"Skill"}
                                 id={"skill"}
                                 type={"number"}
                                 value={values.skill}
                                 onChange={handleChange} />
                    </Grid>
                    <Grid item
                          container
                          spacing={2}
                          direction={"row"}>
                      <Grid item>
                        <TextField label={"Stamina"}
                                   id={"stamina_current"}
                                   type={"number"}
                                   value={values?.stamina_current}
                                   onChange={handleChange} />
                      </Grid><Grid item>
                      <TextField label={"Max Stamina"}
                                 id={"stamina_max"}
                                 type={"number"}
                                 value={values.stamina_max}
                                 onChange={handleChange} />
                    </Grid>
                    </Grid>
                    <Grid item
                          container
                          spacing={2}
                          direction={"row"}>
                      <Grid item>
                        <TextField label={"Luck"}
                                   id={"luck_current"}
                                   type={"number"}
                                   value={values?.luck_current}
                                   onChange={handleChange} />
                      </Grid>
                      <Grid item>
                        <TextField label={"Max Luck"}
                                   id={"luck_max"}
                                   type={"number"}
                                   value={values.luck_max}
                                   onChange={handleChange} />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextField label={"Monies"}
                                 id={"monies"}
                                 type={"number"}
                                 value={values.monies}
                                 onChange={handleChange} />
                    </Grid>
                    <Grid item>
                      <TextField label={"Provisions"}
                                 id={"provisions"}
                                 type={"number"}
                                 value={values.provisions}
                                 onChange={handleChange} />
                    </Grid>
                  </Grid>

                </form>
              </Box>
            </Paper>
          </Grid>
          <Grid item container xs={12} sm={6} direction={'column'}>
            <Grid item xs={12}><Paper>
              <Box p={2} flexGrow={1}>
                <Typography variant={'h6'}>Advanced Skills and Spells</Typography>


              </Box>
            </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterEditor;

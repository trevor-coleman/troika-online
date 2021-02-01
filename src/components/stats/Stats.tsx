import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Paper, TextField } from '@material-ui/core';
import { useFirebaseConnect, isLoaded } from 'react-redux-firebase';
import { useCharacter } from '../../store/selectors';
import Grid from '@material-ui/core/Grid';

interface StatsProps {
  characterKey: string
}

//COMPONENT
const Stats: FunctionComponent<StatsProps> = (props: StatsProps) => {
  const {characterKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect(`/characters/${characterKey}`);
  const character = useCharacter(characterKey);

  const [values, setValues] = useState({
    luck_current: 0,
    luck_max: 0,
    stamina_max: 0,
    stamina_current: 0,
    skill: 0,
  });

  useEffect(() => {
    if (isLoaded(character)) {

      const {
        luck_current,
        luck_max,
        stamina_current,
        stamina_max,
        skill,
      } = character;

      setValues({
        luck_current,
        luck_max,
        stamina_current,
        stamina_max,
        skill,
      });
    }

  }, [character]);

  const allowRollStats = values.luck_current === 0 && values.luck_max === 0 &&
                         values.stamina_current === 0 && values.stamina_max ===
                         0 && values.skill === 0;
  return (
      <div>
        <Typography variant={"h5"}>
          Stats
        </Typography>
        <Button disabled={!allowRollStats}
                onClick={() => {}}>Roll Stats</Button>

        <Paper>

          <Box p={2}>
            <Grid container
                  direction={"row"}>
              <Grid item
                    xs={3}
                    md={3}
                    className={classes.skillGrid}>
                <TextField value={values.skill}
                           variant={"outlined"}
                           label={"Skill"}
                           type={"number"}
                           className={classes.skillField}
                           InputLabelProps={{
                             shrink: true,
                           }}
                           InputProps={{
                             classes: {
                               input: classes.skillInput,
                             },
                           }} />

                <TextField margin={"dense"}
                           disabled
                           variant={"outlined"}
                           value={""}
                           className={classes.skillMaxField}
                           InputProps={{
                             classes: {
                               input: classes.skillMaxInput,
                             },
                           }} />
              </Grid>
              <Grid item
                    xs={3}
                    md={3}
                    className={classes.skillGrid}>
                  <TextField value={values.stamina_current}
                             variant={"outlined"}
                             label={"Stamina"}
                             type={"number"}
                             className={classes.skillField}
                             InputLabelProps={{
                               shrink: true,
                             }}
                             InputProps={{
                               classes: {
                                 input: classes.skillInput,
                               },
                             }} />

                <TextField
                    margin={"dense"}
                    variant={"outlined"}
                    value={values.stamina_current}
                           type={"number"}
                    label={"max"}
                           className={classes.skillMaxField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                             classes: {
                               input: classes.skillMaxInput,
                             },
                           }} />
              </Grid>
              <Grid item
                    container
                    xs={6}
                    md={6}
                    className={classes.skillGrid}>
                <Grid item
                      container
                      direction={'row'}
                      spacing={2}>
                  <Grid item
                        xs={2} />
                  <Grid item
                        xs={4}
                        className={classes.skillGrid}>
                    <TextField value={values.luck_current}
                               variant={"outlined"}
                               label={"Luck"}
                               type={"number"}
                               className={classes.skillField}
                               InputLabelProps={{
                                 shrink: true,
                               }}
                               InputProps={{
                                 classes: {
                                   input: classes.skillInput,
                                 },
                               }} />

                    <TextField margin={"dense"}
                               variant={"outlined"}
                               value={values.luck_max}
                               type={"number"}
                               label={"max"}
                               className={classes.skillMaxField}
                               InputLabelProps={{
                                 shrink: true,
                               }}
                               InputProps={{
                                 classes: {
                                   input: classes.skillMaxInput,
                                 },
                               }} />
                  </Grid>
                  <Grid item
                        xs={6}
                        container
                        direction={"row"}
                        spacing={1}>
                    <Grid item
                          xs={12}>
                      <Button fullWidth
                              variant={"contained"}>Test</Button>
                    </Grid>
                    <Grid item
                          xs={12}>
                      <Button fullWidth
                              variant={"contained"}>Rest</Button>
                    </Grid>

                  </Grid>
                </Grid>

              </Grid>
            </Grid>

          </Box>
        </Paper>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      skillGrid: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      skillContainer: {
        border: "1px solid grey",
        borderRadius: "100%",
        height: "5rem",
        width: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down('sm')]: {
          height: "3rem",
          width: "3rem",
        },
      },
      skillField: {
        width: "6rem",
      },
      skillMaxField: {
        width: "6rem",
      },
      skillInput: {
        margin: "auto",
        textAlign: "center",
        fontSize: "2rem",
        [theme.breakpoints.down('sm')]: {
          paddingLeft: "0.2rem",
          fontSize: "1.5rem",
        },
      },
      skillMaxInput: {
        paddingLeft: ".5rem",
        textAlign: "center",
        fontSize: "1rem",
        [theme.breakpoints.down('sm')]: {
          paddingLeft: "0.2rem",
          fontSize: "1.5rem",
        },
      },

    }));

export default Stats;

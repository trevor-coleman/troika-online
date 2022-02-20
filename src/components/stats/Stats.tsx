import React, {
  FunctionComponent, useEffect, useState, ChangeEvent, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { TextField } from '@material-ui/core';
import {
  useFirebaseConnect, isLoaded, useFirebase,
} from 'react-redux-firebase';
import { GameContext } from '../../contexts/GameContext';
import {useBaseStats, useCharacterName} from '../../store/selectors';
import Grid from '@material-ui/core/Grid';
import { CharacterContext } from '../../contexts/CharacterContext';
import RestDialog from '../rest/RestDialog';

interface StatsProps {}

//COMPONENT
const Stats: FunctionComponent<StatsProps> = () => {
  const classes = useStyles();
  useDispatch();
    const firebase = useFirebase();
  const {character, editable} = useContext(CharacterContext);
  const {roll} = useContext(GameContext);
  useFirebaseConnect([`/baseStats/${character}`, `/bios/${character}/name`]);
  const baseStats = useBaseStats(character);
  const characterName = useCharacterName(character)
  const [open, setOpen] = useState(false);
  const handleCloseRestDialog = () => {setOpen(false);};

  const [values, setValues] = useState({
    luck_current   : 0,
    luck_max       : 0,
    stamina_max    : 0,
    stamina_current: 0,
    skill          : 0,
  });

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {

    const newValue = Math.max(parseInt(e.target.value ? e.target.value : "0"), 0)

    setValues({
      ...values,
      [e.target.id]: newValue,
    });

    firebase.ref(`/baseStats/${character}/${e.target.id}`)
            .set(newValue);
  }

  useEffect(() => {
    if (isLoaded(baseStats)) {

      const {
        luck_current = 0,
        luck_max = 0,
        stamina_current = 0,
        stamina_max = 0,
        skill = 0,
      } = baseStats ?? {};

      setValues({
        luck_current,
        luck_max,
        stamina_current,
        stamina_max,
        skill,
      });
    }

  }, [baseStats]);

  async function spendLuck() {
    setValues({
      ...values,
      luck_current: values.luck_current - 1,
    });
    await firebase.ref(`/baseStats/${character}/luck_current`)
                  .set(baseStats?.luck_current
                       ? Math.max(baseStats.luck_current - 1, 0)
                       : 0);
  }

  async function basicRoll(numberOfDice: number) {
    const dice = [];

    for (let i = 0; i < numberOfDice; i++) {
      dice.push(6);
    }

    await roll({
      type      : 'basic',
      rollerKey : character,
      dice      : dice,
      rollerName: characterName ?? "Someone",
    });
  }

  async function handleRoll(stat: "skill" | "luck_current" | "stamina_current"): Promise<void> {
    let target: number = values[stat];
    let ability: string;
    switch (stat) {
      case 'skill':
        ability = "Skill";
        break;
      case 'luck_current':
        console.log("rolling luck");
        await spendLuck();
        ability = "Luck";
        break;
      case 'stamina_current':
        ability = "Stamina";
        break;

    }

    await roll({
      type       : "skill",
      dice       : [6, 6],
      rolledSkill: ability,
      rollerKey  : character,
      rollerName : characterName ?? "Character",
      target     : target,
    });

  }

  return (
      <div><Grid
          container
          className={classes.container}
          direction={"column"}
          spacing={2}>

        {editable ? <Grid
            item
            xs={12}>
          <Box marginX={2}>
            <Button
                fullWidth
                color={'secondary'}
                onClick={() => setOpen(true)}
                variant={"contained"}>Rest</Button></Box>
        </Grid> :""}
          {editable ? <Grid
              item
              xs={12}
              className={classes.basicRoll}>
              <Button
                  className={classes.basicRollButton}
                  color={"primary"}
                  onClick={() => basicRoll(2)}
                  variant={"outlined"}>
                  Roll 2d6
              </Button>
              <Button
                  className={classes.basicRollButton}
                  color={"primary"}
                  onClick={() => basicRoll(1)}
                  variant={"outlined"}>
                  Roll 1d6
              </Button>

          </Grid> : ""}
        <Grid
            item
            xs={12}
            className={classes.skillGrid}>
          <Button
              disabled={!editable}
              color={"primary"}
              onClick={() => {handleRoll("skill");}}>Skill</Button>
          <TextField
              value={values.skill ?? 0}
              id={"skill"}
              variant={"outlined"}
              disabled={!editable}
              type={"number"}
              className={classes.skillField}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  input: classes.skillInput,
                },
              }} />

          <div className={"dummy"} />
        </Grid>
        <Grid
            item
            xs={12}

            className={classes.skillGrid}>
          <Button
              disabled={!editable}
              onClick={() => {handleRoll("stamina_current");}}
              color={"primary"}>Stamina</Button>
          <TextField
              disabled={!editable}
              value={values.stamina_current ?? 0}
              variant={"outlined"}
              type={"number"}
              id={"stamina_current"}
              error={values.stamina_current > values.stamina_max}
              onChange={handleChange}
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
              disabled={!editable}
              margin={"dense"}
              variant={"outlined"}
              value={values.stamina_max ?? 0}
              type={"number"}
              id={"stamina_max"}
              onChange={handleChange}
              error={values.stamina_current > values.stamina_max}
              label={"max"}
              className={classes.skillMaxField}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                    input: values.stamina_current > values.stamina_max ? classes.skillMaxInputError : classes.skillMaxInput,
                },
              }} />
        </Grid>
        <Grid
            item
            container
            xs={12}
            className={classes.skillGrid}>
          <Button
              disabled={values.luck_current === 0 || !editable}
              onClick={() => {handleRoll("luck_current");}}
              color={"primary"}>Luck</Button>
          <TextField
              disabled={!editable}
              value={values.luck_current ?? 0}
              variant={"outlined"}
              id={"luck_current"}
              type={"number"}
              error={values.luck_current > values.luck_max}
              onChange={handleChange}
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
              disabled={!editable}
              value={values.luck_max ?? 0}
              id={"luck_max"}
              type={"number"}
              label={"max"}
              className={classes.skillMaxField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              error={values.luck_current > values.luck_max}
              InputProps={{
                classes: {
                  input: values.luck_current > values.luck_max ? classes.skillMaxInputError : classes.skillMaxInput,
                },
              }} />
        </Grid>

        <RestDialog
            open={open}
            handleClose={handleCloseRestDialog} />
      </Grid></div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      skillGrid     : {
        display      : "flex",
        flexDirection: "column",
        alignItems   : "center",
      },
      container     : {
        paddingTop: theme.spacing(1),
      },
      skillContainer: {
        border                        : "1px solid grey",
        borderRadius                  : "100%",
        height                        : "5rem",
        width                         : "5rem",
        display                       : "flex",
        alignItems                    : "center",
        justifyContent                : "center",
        [theme.breakpoints.down('sm')]: {
          height: "3rem",
          width : "3rem",
        },
      },
      skillField    : {
        width: "6rem",
      },
      dummy         : {
        width: "6rem",
      },
      skillMaxField : {
        width     : "6rem",
        background: theme.palette.grey['200'],
      },
      skillInput    : {
        margin                        : "auto",
        textAlign                     : "center",
        fontSize                      : "2rem",
        [theme.breakpoints.down('sm')]: {
          paddingLeft: "0.2rem",
          fontSize   : "1.5rem",
        }
      },
      skillMaxInput : {
        paddingLeft                   : ".5rem",
        textAlign                     : "center",
        fontSize                      : "1rem",
        [theme.breakpoints.down('sm')]: {
          paddingLeft: "0.2rem",
          fontSize   : "1.5rem",
        },
      },
        skillMaxInputError: {
            paddingLeft: ".5rem",
            textAlign: "center",
            fontSize: "1rem",
            color: theme.palette.error.main,
            backgroundColor: "#fcdfdf",
            [theme.breakpoints.down('sm')]: {
                paddingLeft: "0.2rem",
                fontSize: "1.5rem",
            },
        },
      basicRoll     : {
        alignItems    : "center",
        display       : "flex",
        justifyContent: "space-evenly",
        margin: theme.spacing(1),

      },
      basicRollButton : {
        flexGrow: 1,
        margin:1,
      }

    }));

export default Stats;

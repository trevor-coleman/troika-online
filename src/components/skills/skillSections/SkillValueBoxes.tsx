import React, { FunctionComponent, useContext, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { CharacterContext } from '../../../views/CharacterContext';
import { SkillContext } from '../context/SkillContext';
import { useTypedSelector } from '../../../store';
import Box from '@material-ui/core/Box/Box';

interface IValueBoxesProps {}

type ValueBoxesProps = IValueBoxesProps;

const SkillValueBoxes: FunctionComponent<IValueBoxesProps> = (props: IValueBoxesProps) => {
  const {} = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  const skill=useContext(SkillContext);
  const firebase=useFirebase();

  useFirebaseConnect([
    {
      path   : `/characters/${character}/skill`,
      storeAs: `skillValues/${character}/totalSkill`,
    },
  ]);

  useFirebaseConnect({
                       path   : `/skillValues/${character}/${skill}`,
                      storeAs:`skillValues/${character}/${skill}`
                     })

  const stateRank = useTypedSelector(state => state.firebase.data?.skillValues?.[character]?.[skill]?.rank) ?? 0;

  const stateSkill = useTypedSelector(state => state.firebase.data?.skillValues?.[character]?.totalSkill) ?? 0;

  const skillSkill  = parseInt(stateSkill);
  const skillRank = parseInt(stateRank)


  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

    let intValue: number = parseInt(e.target.value);

    const newValue = intValue > 0
                     ? intValue
                     : null;


    const newValues = {
      rank: skillRank,
      skill: skillSkill,
      [e.target.id]: newValue,
    };

    firebase.ref(`/skillValues/${character}/${skill}`)
            .set(newValues);
  };

  return (
      <Grid container className={classes.root} alignItems={"center"} justify={"center"}>
        <Grid
          item
          xs={4}>
        <TextField
            type={"number"}
            variant={"outlined"}
            value={skillRank}
            label={"Rank"}
            margin={"dense"}
            id={"rank"}
            className={classes.rankSkillRoot}
            InputProps={{classes: {input: classes.rankSkillInput}}}
            InputLabelProps={{shrink:true}}
            onChange={handleChange} />
      </Grid>
        <Grid
            item
            xs={4}>
          <TextField
              type={"number"}
              variant={"outlined"}
              disabled
              classes={{root: classes.skillRoot}}
              InputLabelProps={{shrink: true}}
              InputProps={{
                readOnly: true,
                classes : {
                  disabled: classes.skillInputRoot,
                }
              }}
              margin={"dense"}
              label={"Skill"}
              id={"skill"}
              value={skillSkill}
              className={classes.skillRoot}
              onChange={handleChange} />
        </Grid>
        <Grid
            item
            xs={4}>
          <TextField
              variant={"outlined"}
              disabled
              margin={"dense"}
              label={"Total"}
              classes={{root: classes.totalRoot}}
              InputLabelProps={{shrink: true}}
              InputProps={{readOnly:true, classes: {
                disabled: classes.totalRoot,
                }}}
              value={(
                         skillRank) + (
                         skillSkill)}
              type={"number"} />
        </Grid>
      </Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        width:"100%",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
      rankSkillInput: {
        margin:"auto",
        textAlign  : "center",
      },
      rankSkillRoot: {
        margin: 0,
        textAlign: "center",
      },
      skillRoot: {
        margin   : 0,
        textAlign: "center",
      },
      totalRoot: {
        margin: 0,
        fontWeight:"bold",
        backgroundColor: theme.palette.grey['200'],
        borderRadius: theme.shape.borderRadius,
        color:theme.palette.text.secondary,
        textAlign: "center",
      },
      skillInputRoot: {
        margin         : 0,
        borderRadius   : theme.shape.borderRadius,
        color          : theme.palette.text.disabled,
        textAlign      : "center",
      },
    }));

export default SkillValueBoxes;

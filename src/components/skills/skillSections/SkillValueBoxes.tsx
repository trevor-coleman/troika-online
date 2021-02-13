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

  useFirebaseConnect({
                       path   : `/skillValues/${character}/${skill}`,
                      storeAs:`skillValues/${character}/${skill}`
                     })

  const {
    rank : skillRank = 0,
    skill: skillSkill = 0,
  } = useTypedSelector(state => state.firebase.data?.skillValues?.[character]?.[skill]) ?? {};


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
      <Box p={2}><Grid container className={classes.root}><Grid
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
              InputLabelProps={{shrink: true}}
              InputProps={{classes: {input: classes.rankSkillInput}}}
              margin={"dense"}
              label={"Skill"}
              id={"skill"}
              value={skillSkill}
              className={classes.rankSkillRoot}
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
              InputLabelProps={{shrink: true}}
              InputProps={{readOnly:true, classes: {
                disabled: classes.totalRoot,
                }}}
              value={(
                         skillRank) + (
                         skillSkill)}
              classes={{root: classes.totalRoot}}
              type={"number"} />
        </Grid>
      </Grid></Box>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        width:"100%",
      },
      rankSkillInput: {
        margin:"auto",
        textAlign  : "center",
      },
      rankSkillRoot: {
        margin: 0,
        textAlign: "center",
      },
      totalRoot: {
        margin: 0,
        backgroundColor: theme.palette.grey['200'],
        borderRadius: theme.shape.borderRadius,
        color:theme.palette.text.secondary,
        textAlign: "center",
      },
    }));

export default SkillValueBoxes;

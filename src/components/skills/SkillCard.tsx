import React, {
  FunctionComponent, ChangeEvent, useState, useCallback, useContext,
} from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { useAuth } from '../../store/selectors';
import { CharacterContext } from '../../views/CharacterContext';
import {
  Card, Checkbox, TextField, CardContent, Collapse, FormControlLabel,
} from '@material-ui/core';
import { ExpandMore, Casino, Edit } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExpandCollapseButton from '../ExpandCollapseButton';

interface ISkillCardProps {
  skill: string,
  onEdit: (key: string) => void,
  onRemove: (key: string) => void,
}

type SkillCardProps = ISkillCardProps;

const SkillCard: FunctionComponent<ISkillCardProps> = (props: ISkillCardProps) => {
  const {
    skill,
    onEdit,
    onRemove,
  } = props;
  const {character} = useContext(CharacterContext);
  const classes = useStyles();

  useFirebaseConnect([
                       {
                         path   : `/skills/${character}/${skill}`,
                         storeAs: `skillTableRow/${character}/${skill}/skill`,
                       }, {
      path   : `/skillValues/${character}/${skill}`,
      storeAs: `skillTableRow/${character}/${skill}/skillValues`,
    },
                     ]);

  const {
    skill: skillInfo,
    skillValues,
  } = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]) ??
      {};

  const {
    skill: skillSkill = 0,
    rank : skillRank = 0,
    used : skillUsed = false,
  } = skillValues ?? {};
  const {
    name = "",
    description = "",
    owner = "",
  } = skillInfo ?? {};

  const firebase = useFirebase();
  const auth = useAuth();

  const handleChecked = (e: ChangeEvent<HTMLInputElement>, used: boolean) => {
    const newValues = {
      ...skillValues,
      used,
    };

    firebase.ref(`/skillValues/${character}/${skill}`)
            .set(newValues);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

    let intValue: number = parseInt(e.target.value);
    const newValue = intValue > 0
                     ? intValue
                     : 0;

    const newValues = {
      ...skillValues,
      [e.target.id]: newValue,
    };

    firebase.ref(`/skillValues/${character}/${skill}`)
            .set(newValues);
  };

  const [expand, setExpand] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpand(!expand);
  }, [expand]);


  return (
      <Box className={classes.SkillCard}>
          <Grid
              container
              spacing={0}>
            <Grid
                item
                container
                xs={12}>
              {/*Checkbox*/}
              <Grid
                  xs={1}
                  item>
                <Checkbox
                        className={classes.checkBox}
                        size={"small"} />

              </Grid>
              {/*Name*/}
              <Grid
                  xs={3}
                  item>
                <Typography className={classes.name}>
                  {name}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {description?.length
                 ? <ExpandCollapseButton expand={expand} onClick={toggleExpand}/>
                 :""}
              </Grid>
              {/*Fields*/}
              <Grid
                  xs={5}
                  item
                  container
                  spacing={1}
              >
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
                      onChange={handleChange} />
                </Grid>
                <Grid
                    item
                    xs={4}>
                  <TextField
                      type={"number"}
                      variant={"outlined"}
                      margin={"dense"}
                      label={"Skill"}
                      id={"skill"}
                      value={skillSkill ?? 0}
                      className={classes.rankSkillRoot}
                      onChange={handleChange} />
                </Grid>
                <Grid
                    item
                    xs={4}>
                  <TextField
                      variant={"outlined"}
                      margin={"dense"}
                      label={"Total"}
                      value={(
                                 skillRank) + (
                                 skillSkill)}
                      className={classes.rankSkillRoot}
                      type={"number"} />
                </Grid>
              </Grid>
              {/*Button*/}
              <Grid item xs={2} alignItems={"center"} justify={"center"} container spacing={1}>
                <Grid item>
                  <Button variant="contained" onClick={() => onEdit(skill)} >
                    <Edit />
                </Button>
                </Grid>
                <Grid item>
                  <Button
                      variant={"contained"}
                      color={"secondary"}
                      fullWidth
                  >
                    <Casino />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
              <Grid item container xs={12}>
                <Grid item xs={1}/>
                <Grid item xs={4}>
                  <Collapse in={expand}><Typography
                    className={classes.description}
                    variant={'body2'}>
                    {description}
                  </Typography></Collapse>
              </Grid>
                <Grid
                    item
                    xs={4}>
                </Grid>
                <Grid container item xs={2}
                      alignItems={"center"}
                      justify={"center"}>
                  <Grid item>
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
      </Box>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      checkBox      : {
        margin: 0,
      },
      usedLabel: {
        fontSize:theme.typography.fontSize - 3
      },
      SkillCard     : {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
      },
      rankSkillRoot : {
        margin: 0,
      },
      totalRoot     : {
        width       : "4rem",
        paddingLeft : 0,
        paddingRight: 0,
      },
      expandButton  : {},
      rankSkillInput: {
        textAlign  : "center",
        paddingLeft: "1rem",
      },
      description   : {
        hyphens: "auto",
        color: theme.palette.text.secondary,
      },

      name      : {
        height       : "1.2rem",
        lineHeight   : "1.2rem",
        paddingTop   : theme.spacing(1),
        paddingBottom: theme.spacing(1),
        verticalAlign: "middle",
        margin       : "auto auto",
      },
      totalInput: {
        textAlign  : "center",
        paddingLeft: "1rem",
        fontWeight : "bold",
        marginLeft : theme.spacing(1),
        background : theme.palette.grey['400'],
        color      : theme.palette.primary.dark,
      },
    }));

export default SkillCard;

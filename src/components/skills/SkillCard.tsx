import React, {
  FunctionComponent, useState, useCallback, useContext,
} from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebaseConnect } from 'react-redux-firebase';
import { GameContext } from '../../contexts/GameContext';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../contexts/CharacterContext';
import { Checkbox } from '@material-ui/core';
import { Casino, Edit, Info } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SkillValueBoxes from './skillSections/SkillValueBoxes';
import IconButton from '@material-ui/core/IconButton';
import { SkillContext } from './context/SkillContext';
import SkillInfoButton from './skillSections/SkillInfoButton';
import SkillInfoPopperContent from './SkillInfoPopperContent';


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
  const {roll} = useContext(GameContext);
  const classes = useStyles();

  useFirebaseConnect([
    {
      path   : `/skills/${character}/${skill}/name`,
      storeAs: `/skillTableRow/${character}/${skill}/name`,
    }, {
      path   : `/characters/${character}/name`,
      storeAs: `/skillTableRow/${character}/name`,
    }, {
      path   : `/characters/${character}/skill`,
      storeAs: `/skillTableRow/${character}/totalSkill`,
    }, {
      path   : `/skillValues/${character}/${skill}/rank`,
      storeAs: `skillTableRow/${character}/${skill}/rank`,
    },
  ]);

  const name = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.name) ??
               "";
  const characterName = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.name) ??
                        "";
  const rank = parseInt(useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.rank) ??
               0);
  const total = parseInt(useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.totalSkill) ??
                0);

  const [expand, setExpand] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpand(!expand);
  }, [expand]);

  async function rollSkill(): Promise<void> {
   const thisRoll = await roll({
      dice         : [6, 6],
      rolledAbility: name,
      rollerName   : characterName,
      target       : rank + total,
    });

   console.log(thisRoll)
  }

  return (
      <SkillContext.Provider value={skill}>
        <Grid
            container
            className={classes.SkillCard}>
          <Grid
              item
              xs={12}
              container>
            {/*Checkbox*/}
            <Grid
                item
                xs={1}
                container
                alignItems={"center"}
                justify={"center"}>
              <div><Checkbox
                  className={classes.checkBox}
                  size={"small"} /></div>
            </Grid>
            {/*Name*/}
            <Grid
                item
                container
                xs={3}
                alignItems={"center"}
                justify={"flex-start"}>
              <Grid item>
                <Button color={"primary"} onClick={rollSkill}>{name}</Button>
              </Grid>
            </Grid>
            <Grid
                item
                container
                xs={1}
                alignItems={"center"}
                justify={"center"}>
              <Grid item><SkillInfoButton><SkillInfoPopperContent /></SkillInfoButton></Grid>
            </Grid>
            {/*Fields*/}
            <Grid
                item
                xs={5}>
              <SkillValueBoxes />
            </Grid>
            {/*Button*/}
            <Grid
                item
                xs={2}
                alignItems={"center"}
                justify={"center"}
                container
                spacing={1}
            >
              <Grid item><Button
                  variant="contained"
                  fullWidth
                  onClick={() => onEdit(skill)}>
                <Edit />
              </Button></Grid>
            </Grid>
          </Grid>

        </Grid>
      </SkillContext.Provider>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      checkBox    : {
        padding: theme.spacing(2),
      },
      usedLabel   : {
        fontSize: theme.typography.fontSize - 3,
      },
      collapseRoot: {
        flexGrow  : 1,
        hyphens   : "auto",
        whiteSpace: "normal",
        maxWidth  : "100%",
      },
      collapse    : {
        flexGrow: 1,
        width   : "100%",
      },
      SkillCard   : {
        backgroundColor: theme.palette.background.paper,
      },

      expandButton: {},

      name: {},
    }));

export default SkillCard;

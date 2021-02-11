import React, {
  FunctionComponent, useState, ChangeEvent, useCallback, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  TableCell, Checkbox, TextField, TableRow, Collapse, Fade,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { useAuth } from '../../store/selectors';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ExpandMore, ExpandLess, Casino } from '@material-ui/icons';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../views/CharacterContext';

interface SkillTableRowProps {
  skill: string,
  onEdit: (key: string) => void,
  onRemove: (key: string) => void,

}

//COMPONENT
const SkillTableRow: FunctionComponent<SkillTableRowProps> = (props: SkillTableRowProps) => {
  const {
    skill,
    onEdit,
    onRemove,
  } = props;
  const {character} = useContext(CharacterContext);
  const classes = useStyles();
  const dispatch = useDispatch();
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
  const [textExpand, setTextExpand] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpand(!expand);
  }, [expand]);

  return (

      <React.Fragment><TableRow key={skill}>
        <TableCell padding={"checkbox"}>
          <Checkbox id="used"
                    checked={skillUsed ?? false}
                    onChange={handleChecked} />
        </TableCell>
        <TableCell className={classes.nameCell}>
          <Typography>
            {name}
          </Typography>
        </TableCell>
        <TableCell className={classes.descriptionCell}>
          <Collapse in={expand} onEnter={()=>setTextExpand(true)} onExited={()=>setTextExpand(false)}
                    collapsedHeight={"1.2rem"} classes={{container: classes.descriptionCollapse, wrapperInner: classes.descriptionWrapperInner }} >
               <Typography noWrap={!textExpand} component={"div"}
                             variant={"body2"}>
                 {description}
               </Typography>
          </Collapse>
        </TableCell>
        <TableCell>
          <IconButton onClick={toggleExpand}
                      className={classes.expandButton}>
            {!expand
             ? <Fade in={!expand}><ExpandMore /></Fade>
             : ""}
            {expand
             ? <Fade in={expand}><ExpandLess /></Fade>
             : ""}
          </IconButton>
        </TableCell>
        <TableCell align={"center"}
                   padding={"none"}>
          <TextField type={"number"}
                     classes={{root: classes.rankSkillRoot}}
                     InputProps={{
                       classes: {
                         input: classes.rankSkillInput,
                       },
                     }}
                     value={skillRank}
                     id={"rank"}
                     onChange={handleChange} />
        </TableCell>
        <TableCell align={"center"}
                   padding={"none"}>
          <TextField type={"number"}
                     id={"skill"}
                     classes={{root: classes.rankSkillRoot}}
                     InputProps={{
                       classes: {
                         input: classes.rankSkillInput,
                       },
                     }}
                     value={skillSkill ?? 0}
                     onChange={handleChange} />
        </TableCell>
        <TableCell align={'center'}
                   padding={'none'}>
          <TextField classes={{root: classes.totalRoot}}
                     InputProps={{
                       disableUnderline: true,
                       readOnly        : true,
                       classes         : {
                         input: classes.totalInput,
                       },
                     }}
                     value={(
                                skillRank) + (
                                skillSkill)}
                     type={"number"} />
        </TableCell>
        <TableCell>
          <IconButton disabled
                      color="primary"><Casino /></IconButton>
        </TableCell>
      </TableRow>

      </React.Fragment>);
};

const useStyles = makeStyles((theme: Theme) => {

  return (
      {
        root              : {},
        rankSkillRoot     : {
          width       : "3rem",
          paddingLeft : 0,
          paddingRight: 0,
        },
        totalRoot         : {
          width       : "4rem",
          paddingLeft : 0,
          paddingRight: 0,
        },
        rankSkillInput    : {
          textAlign  : "center",
          paddingLeft: "1rem",
        },
        collapseRow       : {
          minHeight: 0,
          padding  : 0,
        },
        nameCell          : {
          width: "12em",
        },
        descriptionCell   : {
          [theme.breakpoints.down('xs')]: {
            maxWidth: "1rem"
          },
          minHeight: theme.spacing(6),
          overflow: "hidden",
          minWidth: 0,
          flexShrink:1,
        },
        descriptionWrapperInner: {
          minWidth:0,
        },
        descriptionCollapse: {
          paddingTop: theme.spacing(1),
          paddingBottom:theme.spacing(1),
          alignItems:"center",
          minWidth:0,
        },
        descriptionTextIn: {
          color: "red"
        },

        descriptionTextOut: {
          color:"green",
          minWidth: 0,
        },
        descriptionButton : {
          marginLeft : theme.spacing(1),
          marginRight: theme.spacing(1),
        },
        expandButton      : {
          display: "inline-block",
        },
        totalInput        : {
          textAlign  : "center",
          paddingLeft: "1rem",
          fontWeight : "bold",
          marginLeft : theme.spacing(1),
          background : theme.palette.grey['400'],
          color      : theme.palette.primary.dark,
        },
      });
});

export default SkillTableRow;

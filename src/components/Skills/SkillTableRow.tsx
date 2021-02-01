import React, {
  FunctionComponent, useEffect, useState, ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { TableCell, Checkbox, TextField, TableRow } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {
  useFirebaseConnect, isLoaded, useFirebase,
} from 'react-redux-firebase';
import { SkillValues } from '../../store/Schema';
import {
  useSkill, useCharacter, useCharacterSkillValues,
} from '../../store/selectors';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface SkillTableRowProps {
  skillKey: string,
  characterKey: string,
  onEdit: (key: string) => void,
}

//COMPONENT
const SkillTableRow: FunctionComponent<SkillTableRowProps> = (props: SkillTableRowProps) => {
  const {
    skillKey,
    characterKey,
    onEdit,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect([`/skills/${skillKey}`]);
  useFirebaseConnect([`/characters/${characterKey}/skillValues/${skillKey}`]);

  const skill = useSkill(skillKey);
  const character = useCharacter(characterKey);
  const skillValues = useCharacterSkillValues(characterKey, skillKey);
  const firebase = useFirebase();

  const [values, setValues] = useState<SkillValues>({
    used: false,
    rank: 0,
    skill: 0,
  });

  async function handleChecked(e: ChangeEvent<HTMLInputElement>,
                               used: boolean)
  {
    const newValues = {
      ...values,
      used,
    };
    setValues(newValues);

    await firebase.ref(`/characters/${characterKey}/skillValues/${skillKey}`)
                  .set(newValues);
  }

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {

    let intValue: number = parseInt(e.target.value);
    const newValue = intValue > 0 ? intValue : 0;

    const newValues = {
      ...values,
      [e.target.id]: newValue,
    };

    setValues(newValues);

    await firebase.ref(`/characters/${characterKey}/skillValues/${skillKey}`)
                  .set(newValues);
  }

  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  useEffect(() => {
    if (isLoaded(skillValues)) {
      setValues(skillValues ?? {
        used: false,
        rank: 0,
        skill: 0,
      });
    }

  }, [skillValues]);

  return (
      isLoaded(skill)
      ? <React.Fragment><TableRow key={skillKey}>
        <TableCell padding={"checkbox"}>
          <Checkbox id="used"
                    checked={values.used}
                    onChange={handleChecked} />
        </TableCell>
        <TableCell>
          {skill.name}
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
                     value={values.rank}
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
                     value={values.skill}
                     onChange={handleChange} />
        </TableCell>
        <TableCell align={'center'}
                   padding={'none'}>
          <TextField classes={{root: classes.totalRoot}}
                     InputProps={{
                       disableUnderline: true,
                       readOnly: true,
                       classes: {
                         input: classes.totalInput,
                       },
                     }}
                     value={(
                                values?.rank ?? 0) + (
                                values?.skill ?? 0)}
                     type={"number"} />
        </TableCell>
        <TableCell>
          <IconButton onClick={() => onEdit(skillKey)}><EditIcon /></IconButton>
        </TableCell>
      </TableRow>
      </React.Fragment>

      : <TableRow />);
};

const useStyles = makeStyles((theme: Theme) => {

  return (
      {
        root: {},
        rankSkillRoot: {
          width: "3rem",
          paddingLeft: 0,
          paddingRight: 0,
        },
        totalRoot: {
          width: "4rem",
          paddingLeft: 0,
          paddingRight: 0,
        },
        rankSkillInput: {
          textAlign: "center",
          paddingLeft: "1rem",
        },
        totalInput: {
          textAlign: "center",
          paddingLeft: "1rem",
          fontWeight: "bold",
          marginLeft: theme.spacing(1),
          background: theme.palette.grey['400'],
          color: theme.palette.primary.dark,
          // borderLeft: "1px solid grey",
          // borderRight: "1px solid grey",
        },

      });
});

export default SkillTableRow;

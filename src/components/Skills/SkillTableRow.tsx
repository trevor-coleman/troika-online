import React, {
  FunctionComponent, useEffect, useState, ChangeEvent, useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TableCell, Checkbox, TextField, TableRow } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {
  useFirebaseConnect,
  isLoaded, useFirebase,
} from 'react-redux-firebase';
import { SkillValues } from '../../store/Schema';
import {
  useSkill, useCharacter, useCharacterSkillValues,
} from '../../store/selectors';

interface SkillTableRowProps {
  skillKey: string,
  characterKey: string,
  onEdit: (key:string)=>void,
}

//COMPONENT
const SkillTableRow: FunctionComponent<SkillTableRowProps> = (props: SkillTableRowProps) => {
  const {
    skillKey,
    characterKey,
      onEdit
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect([`/skills/${skillKey}`]);
  useFirebaseConnect([`/characters/${characterKey}/skillValues/${skillKey}`]);

  const skill = useSkill(skillKey);
  const character = useCharacter(characterKey);
  const skillValues = useCharacterSkillValues(characterKey, skillKey);
  const firebase=useFirebase();


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
      used
    };
    setValues(newValues)

    await firebase.ref(`/characters/${characterKey}/skillValues/${skillKey}`).set(newValues)
  }

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {

    const newValues = {
      ...values,
      [e.target.id]: parseInt(e.target.value),
    }

    setValues(newValues);

    await firebase.ref(`/characters/${characterKey}/skillValues`).set(newValues)
  }

  useEffect(() => {
    if (isLoaded(skillValues)) {
      setValues(skillValues ?? {
        used: false,
        rank: 0,
        skill: 0,} );
    }

  }, [skillValues]);

  return (
      isLoaded(skill)
      ? <TableRow key={skillKey}>
        <TableCell className={classes.checkBoxCol}>
          <Checkbox id="used" checked={values.used} onChange={handleChecked} />
        </TableCell>
        <TableCell>
          {skill.name}
        </TableCell>
        <TableCell className={classes.skillRankCol}
                   align={"center"}>
          <TextField type={"number"}
                     value={values.rank}
                     id={"rank"}
                     InputProps={{
                       classes: {
                         input: classes.centeredInput,
                       },
                     }}

                     onChange={handleChange} />
        </TableCell>
        <TableCell className={classes.skillRankCol}
                   align={"center"}>
          <TextField type={"number"}
                     InputLabelProps={{shrink: true}}
                     InputProps={{
                       classes: {
                         input: classes.centeredInput,
                       },
                     }}
                     id={"skill"}
                     value={values.skill}
                     onChange={handleChange} />
        </TableCell>
        <TableCell className={classes.skillRankCol}>
          <TextField InputLabelProps={{
            shrink: true,
            classes: {
              root: classes.skillRankLabel,
            },
          }}
                     InputProps={{
                       disableUnderline: true,
                       readOnly: true,
                       classes: {
                         input: classes.centeredInput,
                       },
                     }}
                     value={(
                                values?.rank ?? 0) + (
                                values?.skill ?? 0)}
                     type={"number"} />
        </TableCell>
        <TableCell><IconButton onClick={()=>onEdit(skillKey)}><EditIcon /></IconButton>
        </TableCell>
      </TableRow>
      : <TableRow />);
};

const useStyles = makeStyles((theme: Theme) => {
  const colPadding = {
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
  };

  return (
      {
        root: {},
        checkBoxCol: {
          ...colPadding,
        },
        nameCol: {
          ...colPadding,
          flex: 1
        },
        skillRankCol: {
          width: "3rem", ...colPadding,
        },
        skillRankLabel: {
          display: "block",
          left: 100,
        },
        centeredInput: {
          textAlign: "center",
        },
        iconButtonCol: {
          ...colPadding,
        },
      });
});

export default SkillTableRow;

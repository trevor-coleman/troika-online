import React, {
  FunctionComponent, ChangeEvent, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useTypedSelector } from '../../store';
import {
  ListItemText,
  Checkbox,
  Collapse,
  ListItemSecondaryAction,
  ListItemAvatar,
  CircularProgress,
} from '@material-ui/core';
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { ExpandMore } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import { Skill } from '../../store/Schema';
import Typography from '@material-ui/core/Typography';

interface SkillsListProps {
  search: string;
  setValues: (values: { [key: string]: Skill }) => void;
  values: { [key: string]: Skill };
}

//COMPONENT
const SrdSkillsList: FunctionComponent<SkillsListProps> = (props: SkillsListProps) => {
  const {
    search = "",
    values,
    setValues,
  } = props;

  useFirebaseConnect([
                       {
                         path       : '/srdSkills',
                         storeAs    : '/addSrdSkills',
                         queryParams: [
                           'orderByChild=sort_name',
                           `startAt=${search}`,
                           `endAt=${search + "\uf8ff"}`
                         ],
                       },
                     ]);

  const skills = useTypedSelector(state => state.firebase.ordered.addSrdSkills);
  const skillKeys: string[] = isLoaded(skills) && !isEmpty(skills)
                             ? Object.keys(skills)
                             : [];



  const handleChange = (key: string, value: Skill | null) => {
    const newValues = {...values};
    if (value === null) {
      delete newValues[key];
    }
    else {
      newValues[key] = value;
    }
    setValues(newValues);

  };

  return (
      isLoaded(skills)
      ? isEmpty(skills)
        ? <Typography>No matches</Typography>
        : <List>
          {skills.map(skill => <SrdSkillsListItem key={skill.key}
                                               skillKey={skill.key}
                                               skill={skill.value}
                                               selected={Boolean(values[skill.key])}
                                               onChange={handleChange} />)}
        </List>
      : <List><ListItem><ListItemText primary={"LOADING"} /> </ListItem></List>)
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root           : {},
      popover        : {
        pointerEvents: 'none',
      },
      listDescription: {
        background: theme.palette.grey['200'],
      },
      paper          : {
        padding : theme.spacing(1),
        maxWidth: theme.spacing(40),
      },
    }));

export default SrdSkillsList;

interface SrdSkillsListItemProps {
  skillKey: string,
  skill: Skill,
  onChange: (key: string, value: Skill | null) => void;
  selected: boolean;
}

const SrdSkillsListItem = ({
                            skillKey,
                            skill,
                            onChange,
                            selected,
                          }: SrdSkillsListItemProps) => {
  useFirebaseConnect([`srdSkills/${skillKey}`]);
  const classes = useStyles();
  const skillInfo = useTypedSelector(state => {
    return state.firebase.data?.srdSkills?.[skillKey];
  });
  const [skillValues, setSkillValues] = useState<Partial<Skill>>({});
  useEffect(() => {
    if (isLoaded(skillInfo)) setSkillValues(skillInfo);
  }, [skillInfo]);

  const [expand, setExpand] = useState(false);

  const toggleExpand = () => setExpand(!expand);

  function handleCheck(e: ChangeEvent<HTMLInputElement>): void {
    onChange(skillKey,
             e.target.checked
             ? skill
             : null);
  }

  return (
      isLoaded(skillInfo)
      ? <><ListItem dense>
        <ListItemAvatar><Checkbox id={skillKey}
                                  onChange={handleCheck}
                                  checked={selected ??
                                           false} /></ListItemAvatar>
        <ListItemText primary={skillValues?.name ?? ""} />
        <ListItemSecondaryAction onClick={toggleExpand}><ExpandMore /></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem dense
                    className={classes.listDescription}>
            <ListItemText inset
                          secondary={skillValues?.description} /></ListItem>
        </Collapse>
        <Divider /></>
      : <ListItem />);
};

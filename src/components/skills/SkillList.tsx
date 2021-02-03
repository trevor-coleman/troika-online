import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useTypedSelector } from '../../store';
import {
  ListItemText, Checkbox, Collapse, ListItemSecondaryAction, ListItemAvatar,
} from '@material-ui/core';
import { useFirebaseConnect } from 'react-redux-firebase';
import { ExpandMore } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

interface SkillListProps {
  skills: string[];
  setValues: (values: { [key: string]: boolean }) => void;
  values: { [key: string]: boolean };
}

//COMPONENT
const SkillList: FunctionComponent<SkillListProps> = (props: SkillListProps) => {
  const {
    skills,
    values,
    setValues,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
  };

  return (
      <List>
        {skills.map(skill => <SkillListItem key={skill}
                                            skill={skill}
                                            selected={values[skill] ?? false}
                                            onChange={handleChange} />)}
      </List>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      popover: {
        pointerEvents: 'none',
      },
      listDescription: {
        background: theme.palette.grey['200'],
      },
      paper: {
        padding: theme.spacing(1),
        maxWidth: theme.spacing(40),
      },
    }));

export default SkillList;

interface SkillListItemProps {
  skill: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
}

const SkillListItem = ({
                         skill,
                         onChange,
                         selected,
                       }: SkillListItemProps) => {
  useFirebaseConnect([`/skills/${skill}`]);
  const classes = useStyles();



  const[expand, setExpand] = useState(false);
  const toggleExpand = ()=> setExpand(!expand);


  const skillInfo = useTypedSelector(state => state.firebase.data.skills[skill]);
  return (
      <><ListItem dense>
        <ListItemAvatar><Checkbox id={skill}
                  onChange={onChange}
                                  checked={selected ?? false} /></ListItemAvatar>
        <ListItemText primary={skillInfo?.name ?? ""} />
        <ListItemSecondaryAction onClick={toggleExpand}><ExpandMore/></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem dense className={classes.listDescription}><ListItemText inset secondary={skillInfo.description}/></ListItem>
        </Collapse>
        <Divider />
      </>
  )

    };

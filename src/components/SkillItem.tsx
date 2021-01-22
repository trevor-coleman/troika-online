import React, { useState } from 'react';
import {
  useFirebaseConnect, useFirebase,
} from 'react-redux-firebase';
import { useTypedSelector } from '../store';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Card, CardContent, Collapse, ListItemIcon } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';

function SkillItem({
                     skillId,
                     parent,
                   }: { skillId: string, parent: string })
{
  useFirebaseConnect('skills');
  const firebase = useFirebase();
  const classes = useStyles();

  const [expand, setExpand] = useState(false);

  const deleteSkill = () => firebase.remove(`skills/${parent}/${skillId}`);

  const toggleExpand = () => setExpand(!expand);

  const skill = useTypedSelector(state => state.firebase.data.skills[parent][skillId]);
  return (
      <div><ListItem>
        <ListItemIcon onClick={toggleExpand}>{expand
                                              ? <ExpandLessIcon />
                                              :
                                              <ExpandMoreIcon />}</ListItemIcon>
        <ListItemText primary={skill.name}
                      primaryTypographyProps={{className: classes.primary}}
                      onClick={() => console.log(`Clicked ${skill.name}`)} />
        <ListItemSecondaryAction><IconButton onClick={deleteSkill}><DeleteIcon /></IconButton></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem onClick={toggleExpand}>
            <ListItemText inset
                          secondary={skill.description} /></ListItem></Collapse>
      </div>);
}

const useStyles = makeStyles(theme => (
    {
      primary: {
        cursor: "pointer",
        color: "black",
        "&:hover": {
          color: "red"
        }
      },
    }));

export default SkillItem;

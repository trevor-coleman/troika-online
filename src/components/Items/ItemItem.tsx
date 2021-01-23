import React, { useState } from 'react';
import {
  useFirebaseConnect, useFirebase,
} from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
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

function ItemItem({
                     itemId,
                     parent,
                   }: { itemId: string, parent: string })
{
  useFirebaseConnect('items');
  const firebase = useFirebase();
  const classes = useStyles();

  const [expand, setExpand] = useState(false);

  const deleteItem = () => firebase.remove(`items/${parent}/${itemId}`);

  const toggleExpand = () => setExpand(!expand);

  const item = useTypedSelector(state => state.firebase.data.items[parent][itemId]);
  return (
      <div><ListItem>
        <ListItemIcon onClick={toggleExpand}>{expand
                                              ? <ExpandLessIcon />
                                              :
                                              <ExpandMoreIcon />}</ListItemIcon>
        <ListItemText primary={item.name}
                      primaryTypographyProps={{className: classes.primary}}
                      onClick={() => console.log(`Clicked ${item.name}`)} />
        <ListItemSecondaryAction><IconButton onClick={deleteItem}><DeleteIcon /></IconButton></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem onClick={toggleExpand}>
            <ListItemText inset
                          secondary={item.description} /></ListItem></Collapse>
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

export default ItemItem;

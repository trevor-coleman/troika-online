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

interface ItemsListProps {
  items: string[];
  setValues: (values: { [key: string]: boolean }) => void;
  values: { [key: string]: boolean };
}

//COMPONENT
const ItemsList: FunctionComponent<ItemsListProps> = (props: ItemsListProps) => {
  const {
    items,
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
        {items.map(item => <ItemsListItem key={item}
                                            item={item}
                                            selected={values[item] ?? false}
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

export default ItemsList;

interface ItemsListItemProps {
  item: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
}

const ItemsListItem = ({
                         item,
                         onChange,
                         selected,
                       }: ItemsListItemProps) => {
  useFirebaseConnect([`/items/${item}`]);
  const classes = useStyles();



  const[expand, setExpand] = useState(false);
  const toggleExpand = ()=> setExpand(!expand);


  const itemInfo = useTypedSelector(state => state.firebase.data.items[item]);
  return (
      <><ListItem dense>
        <ListItemAvatar><Checkbox id={item}
                  onChange={onChange}
                                  checked={selected ?? false} /></ListItemAvatar>
        <ListItemText primary={itemInfo?.name ?? ""} />
        <ListItemSecondaryAction onClick={toggleExpand}><ExpandMore/></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem dense className={classes.listDescription}><ListItemText inset secondary={itemInfo.description}/></ListItem>
        </Collapse>
        <Divider />
      </>
  )

    };

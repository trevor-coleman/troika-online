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
import { Item } from '../../store/Schema';
import Typography from '@material-ui/core/Typography';

interface ItemsListProps {
  search: string;
  setValues: (values: { [key: string]: Item }) => void;
  values: { [key: string]: Item };
}

//COMPONENT
const SrdItemsList: FunctionComponent<ItemsListProps> = (props: ItemsListProps) => {
  const {
    search,
    values,
    setValues,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  useFirebaseConnect([
                       {
                         path       : '/srdItems',
                         storeAs    : '/addSrdItems',
                         queryParams: ['orderByChild=sort_name', `startAt=${search}`, `endAt=${search+"\uf8ff"}`],
                       },
                     ]);

  const items = useTypedSelector(state => state.firebase.ordered.addSrdItems);
  const itemKeys: string[] = isLoaded(items) && !isEmpty(items)
                             ? Object.keys(items)
                             : [];



  const handleChange = (key:string, value: Item|null) => {
    const newValues = {...values};
    if(value === null) {
      delete newValues[key];
    } else {
      newValues[key] = value;
    }
    setValues(newValues);
    console.log(newValues[key],  Boolean(newValues[key]))
  };

  return (
      isLoaded(items)
      ? isEmpty(items)
        ? <Typography>No matches</Typography>
        : <List>
        {items.map(item => <SrdItemsListItem key={item.key}
                                                    itemKey={item.key}
                                                    item={item.value}
                                                    selected={Boolean(values[item.key])}
                                                    onChange={handleChange} />)}
      </List>
      : <List><ListItem><ListItemText primary={"LOADING"}/> </ListItem></List>)
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

export default SrdItemsList;

interface SrdItemsListItemProps {
  itemKey: string,
  item: Item,
  onChange: (key:string, value:Item|null) => void;
  selected: boolean;
}

const SrdItemsListItem = ({
                            itemKey,
                            item,
                            onChange,
                            selected,
                          }: SrdItemsListItemProps) => {
  useFirebaseConnect([`srdItems/${itemKey}`]);
  const classes = useStyles();
  const itemInfo = useTypedSelector(state => {
    return state.firebase.data?.srdItems?.[itemKey];
  });
  const [itemValues, setItemValues] = useState<Partial<Item>>({});
  useEffect(() => {
    if (isLoaded(itemInfo)) setItemValues(itemInfo);
  }, [itemInfo]);

  const [expand, setExpand] = useState(false);

  const toggleExpand = () => setExpand(!expand);

  function handleCheck(e: ChangeEvent<HTMLInputElement>): void {
    onChange(itemKey, e.target.checked ? item : null);
  }

  return (
      isLoaded(itemInfo)
      ? <><ListItem dense>
        <ListItemAvatar><Checkbox id={itemKey}
                                  onChange={handleCheck}
                                  checked={selected ??
                                           false} /></ListItemAvatar>
        <ListItemText primary={itemValues?.name ?? ""} />
        <ListItemSecondaryAction onClick={toggleExpand}><ExpandMore /></ListItemSecondaryAction>
      </ListItem>
        <Collapse in={expand}>
          <ListItem dense
                    className={classes.listDescription}>
            <ListItemText inset
                          secondary={itemValues?.description} /></ListItem>
        </Collapse>
        <Divider /></>
      : <ListItem />);
};

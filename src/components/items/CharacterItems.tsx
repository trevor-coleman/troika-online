import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Paper, ListItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { KeyList } from '../../store/Schema';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import List from '@material-ui/core/List';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AddItemsDialog from './AddItemsDialog';
import NewItemDialog from './NewItemDialog';
import Button from '@material-ui/core/Button';
import {
  useFirebaseConnect, isLoaded, useFirebase,
} from 'react-redux-firebase';
import { useInventory, useItems } from '../../store/selectors';
import InventoryItem from './InventoryItem';
import Grid from '@material-ui/core/Grid';

interface CharacterItemsProps {
  characterKey: string,
  items?: KeyList,
}

const tempItems: {
  [key: string]: {
    size: number
  }
} = {
  "abc": {size: 1},
  "def": {size: 2},
  "ghi": {size: 3},
  "jkl": {size: 1},
};

const spacing = 6;

const initialState: { add: boolean; new: boolean; edit: boolean; remove: boolean } = {
  add   : false,
  new   : false,
  edit  : false,
  remove: false,
};

const CharacterItems: FunctionComponent<CharacterItemsProps> = (props: CharacterItemsProps) => {
  const {
    characterKey,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const inv = useInventory(characterKey);
  const items = useItems(characterKey);

  const [inventory, setInventory] = useState<string[]>([]);

  const firebase = useFirebase();
  useFirebaseConnect([
                       `/characters/${characterKey}/inventory`,
                       `/characters/${characterKey}/items`,
                     ]);

  useEffect(() => {
    if (isLoaded(inv)) setInventory(inv);
  }, [inventory, items]);

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>(
      initialState);

  function showDialog(dialog?: string, key?: string): void {
    const newState = initialState;
    setDialogState(dialog
                   ? {
          ...newState,
          [dialog]: true,
        }
                   : newState);
  }

  async function handleDragEnd(result: DropResult,
                               provided: ResponderProvided): Promise<void> {
    const {
      destination,
      source,
      draggableId,
    } = result;

    if (!destination) return;

    if (destination.droppableId == source.droppableId && destination.index ==
        source.index)
    {
      return;
    }

    const newItemArray: string[] = [...inventory];
    newItemArray.splice(source.index, 1);
    newItemArray.splice(destination.index, 0, draggableId);
    setInventory(newItemArray);
    await firebase.ref(`/characters/${characterKey}/inventory`)
                  .set(newItemArray);
  }

  let inventoryPostition: number = 0;

  return (
      <div>
        <Typography variant={"h5"}>
          Inventory </Typography>
        <Button onClick={() => showDialog("add")}>Import Item</Button>
        <Button onClick={() => showDialog("new")}>New Item</Button>
        <Grid container direction={"column"} spacing={2}>

            {inventory.map((key, index) => (
                <InventoryItem key={key} id={key}/>))}

        </Grid>
        <AddItemsDialog open={dialogState.add}
                        onClose={() => showDialog()}
                        characterKey={characterKey} />
        <NewItemDialog open={dialogState.new}
                       character={characterKey}
                       inventory={inventory}
                       onClose={() => showDialog()} />
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterItems;

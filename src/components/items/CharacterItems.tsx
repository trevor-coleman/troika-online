import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {
  DropResult, ResponderProvided, DragDropContext, Droppable, Draggable,
} from 'react-beautiful-dnd';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AddItemsDialog from './AddItemsDialog';
import NewItemDialog from './NewItemDialog';
import Button from '@material-ui/core/Button';
import {
  useFirebaseConnect, isLoaded, useFirebase, isEmpty,
} from 'react-redux-firebase';
import { useInventory, useItems } from '../../store/selectors';
import InventoryItem from './InventoryItem';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

interface CharacterItemsProps {
  characterKey: string,
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
  useFirebaseConnect([
                       `/characters/${characterKey}/inventory`]);
  const inv = useInventory(characterKey);
  const [inventory, setInventory] = useState<string[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    if (isLoaded(inv)) setInventory(inv ?? []);
    console.log("inventory changed")
  }, [inv]);

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

  const removeItem = (id: string) => {
    const newInventory = [...inventory];

    const index = newInventory.indexOf(id);
    if (index > -1) {
      newInventory.splice(index, 1);
    }

    firebase.ref(`/characters/${characterKey}/inventory`).set(newInventory);
    firebase.ref(`/characters/${characterKey}/items/${id}`).set(null);

    setInventory(newInventory);

  };

  return (
      <div>
        <Typography variant={"h5"}>
          Inventory </Typography>
        <Button onClick={() => showDialog("add")}>Import Item</Button>
        <Button onClick={() => showDialog("new")}>New Item</Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div><Droppable droppableId={`${characterKey}-inventory`}>{(provided) =>
              <Grid container spacing={2}
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}>
                {isLoaded(inventory) && !isEmpty(inventory)
                 ? inventory.map((key, index) => (
                              <InventoryItem key={key}
                                             index={index}
                                             id={key}
                                             characterKey={characterKey}
                                             onRemove={removeItem} />))

                 : <div />}
                {provided.placeholder}
              </Grid>}
          </Droppable></div>
        </DragDropContext>
        <AddItemsDialog open={dialogState.add}
                        inventory={inventory}
                        setInventory={setInventory}
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

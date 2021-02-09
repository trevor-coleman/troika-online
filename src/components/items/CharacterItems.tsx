import React, {
  FunctionComponent,
  useState,
  useEffect, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {
  DropResult, ResponderProvided, DragDropContext, Droppable, Draggable,
} from 'react-beautiful-dnd';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AddItemsDialog from './AddItemsDialog';
import Button from '@material-ui/core/Button';
import {
  useFirebaseConnect, isLoaded, useFirebase, isEmpty,
} from 'react-redux-firebase';
import { useInventory, useItems } from '../../store/selectors';
import InventoryItem from './InventoryItem';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../views/CharacterContext';

interface CharacterItemsProps {
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
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {character} = useContext(CharacterContext)
  useFirebaseConnect({path:`/characters/${character}/inventory`, storeAs:`characterItems/${character}/inventory`});
  const inventory = useTypedSelector(state=>state.firebase.data?.characterItems?.[character]?.inventory)

  const firebase = useFirebase();

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

  const setInventory = (inventory: string[]) => {
    console.log(inventory);}

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
    await firebase.ref(`/characters/${character}/inventory`)
                  .set(newItemArray);
  }

  const removeItem = (id: string) => {
    const newInventory = [...inventory];

    const index = newInventory.indexOf(id);
    if (index > -1) {
      newInventory.splice(index, 1);
    }

    firebase.ref(`/characters/${character}/inventory`).set(newInventory);
    firebase.ref(`/items/${character}/${id}`).set(null);
  };

  const newItem = ()=> {
    const newItem = firebase.ref(`/items/${character}`).push({
      name: "New Item",
      owner: character,
                                                }).key;

    const newInventory = inventory ? [...inventory, newItem] : [newItem];
    firebase.ref(`/characters/${character}/inventory`).set(newInventory);
  }

  return (
      <div>
        <Typography variant={"h5"}>
          Inventory </Typography>
        <Button onClick={() => showDialog("add")}>Import Item</Button>
        <Button onClick={newItem}>New Item</Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div><Droppable droppableId={`${character}-inventory`}>{(provided) =>
              <Grid container spacing={2}
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}>
                {isLoaded(inventory) && !isEmpty(inventory)
                 ? inventory.map((key, index) => (
                              <InventoryItem key={key}
                                             index={index}
                                             id={key}
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
                        characterKey={character} />
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterItems;

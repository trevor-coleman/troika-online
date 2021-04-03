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
import { CharacterContext } from '../../contexts/CharacterContext';
import IconButton from '@material-ui/core/IconButton';
import { AddCircleOutline } from '@material-ui/icons';
import { Fade } from '@material-ui/core';

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

export interface CharacterItemsState {
  inventory: string[],
  weapons: string[]
}

const CharacterItems: FunctionComponent<CharacterItemsProps> = (props: CharacterItemsProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {character} = useContext(CharacterContext)
  useFirebaseConnect([
      {path:`/characters/${character}/inventory`, storeAs:`characterItems/${character}/inventory`},
      {path:`/characters/${character}/weapons`, storeAs:`characterItems/${character}/weapons`},
                     ]);
  const inventory = useTypedSelector(state=>state.firebase.data?.characterItems?.[character]?.inventory) ?? []
  const weapons = useTypedSelector(state=>state.firebase.data?.characterItems?.[character]?.weapons) ?? []


  const firebase = useFirebase();

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>(
      initialState);
  const [addVisible, setAddVisible] = useState(false);

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
    await firebase.ref(`/characters/${character}/inventory`)
                  .set(newItemArray);
  }

  const removeItem = (id: string) => {
    let newInventory = inventory.filter(item=>item!==id);
    let newWeapons = weapons.filter(item=>item!==id);

    firebase.ref(`/characters/${character}/weapons`).set(newWeapons);
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

  const toggleAdd =()=> {
    setAddVisible(!addVisible)
  }

  return (
      <>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={classes.div}>
            <Droppable droppableId={`${character}-inventory`}>{(provided) =>
              <Grid container
                    className={classes.container}
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
          </Droppable>
          </div>
        </DragDropContext>
        <Grid
            container
            className={classes.root}>
          {isEmpty(inventory)
           ? <Grid
               item
               xs={12}
               className={classes.missingMessage}>
             <Typography>Click the button below to add an
                         item</Typography></Grid>
           : ""}
          <Grid
              item
              container
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              xs={12}>
            <Grid item>
              <IconButton onClick={toggleAdd}>
                <AddCircleOutline/>
              </IconButton>
            </Grid>
               <>
                 <Grid item>
                   <Fade in={addVisible}><Typography>Add New Item</Typography></Fade>
               </Grid>
            <Grid item>
              <Fade in={addVisible}><Button
                onClick={() => showDialog("add")}
                variant={"contained"}>From SRD</Button></Fade>
            </Grid>
            <Grid item>
              <Fade in={addVisible}><Button
                onClick={() => newItem()}
                variant={"contained"}>New</Button></Fade>
            </Grid>
               </>
          </Grid>
        </Grid>
        <AddItemsDialog open={dialogState.add}
                        onClose={() => showDialog()}
                        />
      </>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {paddingLeft: theme.spacing(2)},
      container: {width:"100%"},
      div: {width: "100%"},
      missingMessage: {
        color      : theme.palette.text.disabled,
        display    : 'flex',
        alignItems : 'center',
        padding: theme.spacing(4)
      }
    }));

export default CharacterItems;

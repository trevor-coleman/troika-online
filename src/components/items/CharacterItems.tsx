import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { Paper, ListItemText, ListItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { KeyList } from '../../store/Schema';
import {
  DragDropContext, Droppable, Draggable, DropResult, ResponderProvided,
} from 'react-beautiful-dnd';
import List from '@material-ui/core/List';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
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

//COMPONENT
const CharacterItems: FunctionComponent<CharacterItemsProps> = (props: CharacterItemsProps) => {
  const {
    characterKey
  } = props;
  const classes = useStyles();
  const theme=useTheme();
  const dispatch = useDispatch();
  const [items,setItems] = useState<string[]>(Object.keys(tempItems))

  function handleDragEnd(result: DropResult,
                         provided: ResponderProvided): void {
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

    const newItemArray: string[] = items;
    newItemArray.splice(source.index, 1);
    newItemArray.splice(destination.index, 0, draggableId);

    setItems(newItemArray);
  }



  return (
      <div>
        <Typography variant={"h5"}>
          Items </Typography>
        <Paper><Box p={2}>
          <DragDropContext onDragStart={() => {}}
                           onDragUpdate={() => {}}
                           onDragEnd={handleDragEnd}>
            <Grid container>
              <Grid item container direction={"column"} xs={1}>
                <List>
                  {Array.from({length: 12}, (_, i) => i + 1).map(
                        (item,index)=>(<ListItem key={`1st-col-${index}`} style={{height: theme.spacing(spacing)}}><ListItemText primary={(index + 1).toString()}/> </ListItem>))}
                </List>
              </Grid>
              <Grid item container xs={5}>
              <Grid item
                                  xs={6}><Droppable droppableId={characterKey +
                                                                 "-items"}>{provided => (
                <List innerRef={provided.innerRef} {...provided.droppableProps} >
                  {items.map((item, index) => {
                    return (
                        <DraggableItem key={item} item={item} index={index}></DraggableItem>);
                  })
                  }
                  {provided.placeholder}
                </List>)}
            </Droppable>
              </Grid>
              </Grid>
            </Grid>

          </DragDropContext>
        </Box></Paper>
      </div>);
};

const DraggableItem = (props:{item:string, index:number})=> {
  const classes=useItemStyles(props);
  const theme=useTheme();
  const {item,index}=props;
  return (
      <Draggable key={item}
                 draggableId={item}
                 index={index}>
        {provided => (
            <ListItem {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      innerRef={provided.innerRef}
                      className={classes.listItem}

            >
              <ListItemText  primary={`${item}-${tempItems[item].size}` } />
            </ListItem>)}</Draggable>);
}

const useItemStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      listItem: {
        backgroundColor: theme.palette.background.paper,
        border: "1px solid lightgrey",
        height: (props: { index: number, item: string }) => theme.spacing(
            tempItems[props.item].size * spacing),
      },
    }));

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterItems;

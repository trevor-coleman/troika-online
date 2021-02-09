import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, Dialog, DialogActions, TextField,
} from '@material-ui/core';
import { useFirebase } from 'react-redux-firebase';
import { useAuth } from '../../store/selectors';
import SrdItemsList from './SrdItemsList';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Item } from '../../store/Schema';
import CircularProgress from '@material-ui/core/CircularProgress';

interface AddItemsDialogProps {
  open: boolean,
  characterKey: string,
  onClose: () => void,
  inventory: string[],
  setInventory: (i: string[]) => void;
}

function a11yProps(index: any) {
  return {
    id             : `items-tab-${index}`,
    'aria-controls': `items-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

//COMPONENT
const AddItemsDialog: FunctionComponent<AddItemsDialogProps> = (props: AddItemsDialogProps) => {
  const {
    open,
    onClose,
    characterKey,
    inventory,
    setInventory,
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();

  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<{ [key: string]: Item }>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const addSelectedItemsToCharacter = async () => {
    setIsAdding(true);
    const newKeys = [];
    const itemsRef = firebase.ref(`/characters/${characterKey}/items`);
    for (let selectedKey in selection) {
      const newKey = itemsRef.push().key;
      if (!newKey) {
        console.error("Failed to create item",
                      selectedKey,
                      selection[selectedKey]);
        return;
      }
      newKeys.push(newKey);
      itemsRef.child(newKey).set(selection[selectedKey]);
    }

    const newInventory = inventory.concat(newKeys);
    setInventory(newInventory);
    await firebase.ref(`/characters/${characterKey}/inventory`)
                  .set(newInventory);

    setSelection({});
    setSearch("");
    onClose();
    setIsAdding(false);
  };

  return (
      <Dialog open={open}
              onClose={onClose}
              maxWidth={"sm"}
              fullWidth>
        <DialogTitle>Add Items</DialogTitle>

        <DialogContent classes={{root: classes.contentRoot}}>
          <div className={classes.container}>
            {isAdding
             ? <CircularProgress />
             : <>
             <div className={classes.tabs}>
               <div className={classes.search}>
                 <TextField label={"search"}
                            variant={'outlined'}
                            size={'small'}
                            value={search}
                            onChange={handleSearch} />
               </div>
             </div>
             <div className={classes.tabContent}>
               <div className={classes.scrollList}>
                 <SrdItemsList search={search}
                               values={selection}
                               setValues={setSelection} />
               </div>

             </div> </>
             }

          </div>
        </DialogContent>
        <DialogActions><Button variant={"contained"}
                               onClick={addSelectedItemsToCharacter}>Add to
                                                                     Character</Button></DialogActions>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root       : {},
      dialog     : {},
      tabs       : {
        width          : "50vw",
        position       : "fixed",
        backgroundColor: theme.palette.background.paper,
        zIndex         : 100,
      },
      contentRoot: {
        paddingTop: 0,
      },
      tabContent : {
        paddingTop: theme.spacing(9),
      },
      container  : {
        width : "50vw",
        height: "50vh",
      },
      search     : {
        padding   : theme.spacing(1),
        background: theme.palette.grey['200'],
      },
      scrollList : {
        overflow: "auto",
      },
    }));

export default AddItemsDialog;

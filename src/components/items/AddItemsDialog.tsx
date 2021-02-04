import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, Dialog, Tabs, Tab, DialogActions, TextField,
} from '@material-ui/core';
import {
  useFirebaseConnect, isLoaded, isEmpty, useFirebase,
} from 'react-redux-firebase';
import { useAuth } from '../../store/selectors';
import { useTypedSelector } from '../../store';
import ItemsList from './ItemsList';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { KeyList } from '../../store/Schema';

interface AddItemsDialogProps {
  open: boolean,
  characterKey: string,
  onClose: () => void
}

function a11yProps(index: any) {
  return {
    id: `items-tab-${index}`,
    'aria-controls': `items-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {

  const classes = useStyles();

  const {
    children,
    value,
    index,
    ...other
  } = props;

  return (
      <div role="tabpanel"
           hidden={value !== index}
           id={`items-tabpanel-${index}`}
           aria-labelledby={`items-tab-${index}`}
           {...other}
           className={classes.scrollList}>
        {value === index && (
            <Box p={3}>
              {children}
            </Box>)}
      </div>);
}

//COMPONENT
const AddItemsDialog: FunctionComponent<AddItemsDialogProps> = (props: AddItemsDialogProps) => {
  const {
    open,
    onClose,
    characterKey,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useAuth();
  const firebase = useFirebase();

  const [value, setValue] = useState(0);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<KeyList>({});

  useFirebaseConnect([
    {path: `/characters/${characterKey}/items`}, {
      path: 'items',
      storeAs: 'addItems_myItems',
      queryParams: ['orderByChild=owner', `equalTo=${auth.uid}`],
    }, {
      path: 'items',
      storeAs: 'addItems_srdItems',
      queryParams: ['orderByChild=owner', `equalTo=srd`],
    },
  ]);

  const myItems = useTypedSelector(state => state.firebase.data?.addItems_myItems);
  const srdItems = useTypedSelector(state => state?.firebase?.data?.addItems_srdItems);
  const characterItemKeys = useTypedSelector(state => state?.firebase?.data?.characters?.[characterKey]?.items
                                                      ? Object.keys(state.firebase.data.characters[characterKey].items)
                                                      : []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const myItemKeys: string[] = isLoaded(myItems) && !isEmpty(myItems)
                               ? Object.keys(myItems)
                                       .filter(key => characterItemKeys.indexOf(
                                           key) === -1)
                                       .filter(key => myItems[key].name.toLowerCase()
                                                                  .includes(
                                                                      search))
                               : [];

  const srdItemKeys: string[] = isLoaded(srdItems) && !isEmpty(srdItems)
                                ? Object.keys(srdItems)
                                        .filter(key => characterItemKeys.indexOf(
                                            key) === -1)
                                        .filter(key => srdItems[key].name.toLowerCase()
                                                                    .includes(
                                                                        search))
                                : [];

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const addToCharacter = async () => {
    let selectedKeys: string[] = [];
    const updateObj = Object.keys(selection)
                            .reduce<KeyList>((prev: KeyList,
                                              curr: string,
                                              index) => {
                              if (selection[curr]) {
                                selectedKeys.push(curr);
                                return {
                                  ...prev,
                                  [curr]: true,
                                };
                              }
                              return prev;
                            }, {});

    const updatePromises = selectedKeys.map(key => firebase.ref(`/items/${key}/character/${characterKey}`)
                                                           .set(true));
    updatePromises.push(firebase.ref(`/characters/${characterKey}/items`)
                                .update(updateObj));
    await Promise.all(updatePromises);

    setSelection({});
    onClose();
  };

  return (
      <Dialog open={open}
              onClose={onClose}
              maxWidth={"sm"}
              fullWidth>
        <DialogTitle>Add Items</DialogTitle>

        <DialogContent classes={{root: classes.contentRoot}}>
          <div className={classes.container}>

            <div className={classes.tabs}>
              <Tabs value={value}
                    aria-label="select-items-list"
                    onChange={handleChange}>
                <Tab label="My Items" {...a11yProps(1)} />
                <Tab label="SRD" {...a11yProps(2)} />
                <Tab label="Community" {...a11yProps(3)} />
              </Tabs>
              <div className={classes.search}><TextField label={"search"}
                                                         variant={'outlined'}
                                                         size={'small'}
                                                         value={search}
                                                         onChange={handleSearch} />
              </div>
            </div>
            <div className={classes.tabContent}>
              <TabPanel index={0}
                        value={value}>
                <div className={classes.scrollList}>
                  <ItemsList items={srdItemKeys}
                             values={selection}
                             setValues={setSelection} />
                </div>
              </TabPanel>
              <TabPanel index={1}
                        value={value}>
                <div className={classes.scrollList}>
                  <ItemsList items={srdItemKeys}
                             values={selection}
                             setValues={setSelection} /></div>
              </TabPanel>
            </div>
          </div>
        </DialogContent>
        <DialogActions><Button variant={"contained"}
                               onClick={addToCharacter}>Add to
                                                        Character</Button></DialogActions>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      dialog: {},
      tabs: {
        width: "50vw",
        position: "fixed",
        backgroundColor: theme.palette.background.paper,
        zIndex: 100,
      },
      contentRoot: {
        paddingTop: 0,
      },
      tabContent: {
        paddingTop: theme.spacing(9),
      },
      container: {
        width: "50vw",
        height: "70vh",
      },
      search: {
        padding: theme.spacing(1),
        background: theme.palette.grey['200'],
      },
      scrollList: {
        overflow: "auto",
      },
    }));

export default AddItemsDialog;

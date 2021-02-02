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
import SkillList from './SkillList';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { KeyList } from '../../store/Schema';

interface AddSkillsDialogProps {
  open: boolean,
  characterKey: string,
  onClose: () => void
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
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
           id={`simple-tabpanel-${index}`}
           aria-labelledby={`simple-tab-${index}`}
           {...other}
           className={classes.scrollList}>
        {value === index && (
            <Box p={3}>
              {children}
            </Box>)}
      </div>);
}

//COMPONENT
const AddSkillsDialog: FunctionComponent<AddSkillsDialogProps> = (props: AddSkillsDialogProps) => {
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
  const [selection, setSelection] = useState<{ [key: string]: boolean }>({});

  useFirebaseConnect([
    {path: `/characters/${characterKey}/skills`}, {
      path: 'skills',
      storeAs: 'addSkills_mySkills',
      queryParams: ['orderByChild=owner', `equalTo=${auth.uid}`],
    }, {
      path: 'skills',
      storeAs: 'addSkills_srdSkills',
      queryParams: ['orderByChild=owner', `equalTo=srd`],
    },
  ]);

  const mySkills = useTypedSelector(state => state.firebase.data?.addSkills_mySkills);
  const srdSkills = useTypedSelector(state => state?.firebase?.data?.addSkills_srdSkills);
  const characterSkillKeys = useTypedSelector(state => state?.firebase?.data?.characters?.[characterKey]?.skills
                                                       ? Object.keys(state.firebase.data.characters[characterKey].skills)
                                                       : []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const mySkillKeys: string[] = isLoaded(mySkills) && !isEmpty(mySkills)
                                ? Object.keys(mySkills)
                                        .filter(key => characterSkillKeys.indexOf(
                                            key) === -1)
                                        .filter(key => mySkills[key].name.toLowerCase()
                                                                    .includes(
                                                                        search))
                                : [];

  const srdSkillKeys: string[] = isLoaded(srdSkills) && !isEmpty(srdSkills)
                                 ? Object.keys(srdSkills)
                                         .filter(key => characterSkillKeys.indexOf(
                                             key) === -1)
                                         .filter(key => srdSkills[key].name.toLowerCase()
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

    const updatePromises = selectedKeys.map(key => firebase.ref(`/skills/${key}/character/${characterKey}`)
                                                           .set(true));
    updatePromises.push(firebase.ref(`/characters/${characterKey}/skills`)
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
        <DialogTitle>Add Skills</DialogTitle>

        <DialogContent classes={{root: classes.contentRoot}}>
          <div className={classes.container}>

            <div className={classes.tabs}>
              <Tabs value={value}
                    aria-label="select-skills-list"
                    onChange={handleChange}>
                <Tab label="My Skills" {...a11yProps(1)} />
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
                  <SkillList skills={mySkillKeys}
                             values={selection}
                             setValues={setSelection} />
                </div>
              </TabPanel>
              <TabPanel index={1}
                        value={value}>
                <div className={classes.scrollList}>
                  <SkillList skills={srdSkillKeys}
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
        width:"50vw",
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

export default AddSkillsDialog;

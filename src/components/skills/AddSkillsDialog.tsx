import React, {
  FunctionComponent,
  ChangeEvent,
  useState,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, Dialog, DialogActions, TextField,
} from '@material-ui/core';
import SrdSkillsList from './SrdSkillList';
import Button from '@material-ui/core/Button';
import { Skill } from '../../store/Schema';
import CircularProgress from '@material-ui/core/CircularProgress';

interface AddSkillsDialogProps {
  open: boolean,
  character: string,
  onClose: () => void,
  onAdd: (skills: { [key:string]:Skill })=> Promise<void>,
}


//COMPONENT
const AddSkillsDialog: FunctionComponent<AddSkillsDialogProps> = (props: AddSkillsDialogProps) => {
  const {
    open,
    onClose,
      onAdd,
  } = props;

  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<{ [key: string]: Skill }>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const addSelectedSkillsToCharacter = async () => {
    setIsAdding(true);
    await onAdd(selection);

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
        <DialogTitle>Add Skills</DialogTitle>

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
                   <SrdSkillsList search={search}
                                 values={selection}
                                 setValues={setSelection} />
                 </div>

               </div>
             </>}

          </div>
        </DialogContent>
        <DialogActions><Button variant={"contained"}
                               onClick={addSelectedSkillsToCharacter}>Add to
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

export default AddSkillsDialog;

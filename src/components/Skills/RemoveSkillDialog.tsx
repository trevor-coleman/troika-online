import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  Dialog, DialogActions,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useAuth, useSkill } from '../../store/selectors';
import {
  useFirebase, useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';

interface EditSkillDialogProps {
  open: boolean;
  onClose: (remove: boolean) => void;
  skillKey: string;
  character: string | null;
}

//COMPONENT
const EditSkillDialog: FunctionComponent<EditSkillDialogProps> = (props: EditSkillDialogProps) => {
  const {
    open,
    onClose,
    character,
    skillKey,
  } = props;
  const auth = useAuth();
  const firebase = useFirebase();
  const classes = useStyles();
  useFirebaseConnect([`skills/${skillKey}`]);
  const skill = useSkill(skillKey);

  const [removeFromLibrary, setRemoveFromLibrary] = useState<boolean>(false);

  const handleClose = async (remove?: boolean) => {
    onClose(remove ?? false);
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {

  };

  return (
      <Dialog open={open}
              onClose={() => handleClose(false)}>
        {isLoaded(skill)
         ? <> <DialogTitle>Remove {skill.name ?? ""}?</DialogTitle>

         <DialogActions>
           <Button onClick={() => handleClose(false)}
                   variant={"contained"}
                   className={classes.buttons}>Cancel</Button>
           <Button onClick={() => handleClose(true)}
                   color={'secondary'}
                   variant={"contained"}
                   className={classes.buttons}>Remove</Button>
         </DialogActions>
         </>
         : " "}
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      buttons: {marginRight: theme.spacing(2)},
    }));

export default EditSkillDialog;

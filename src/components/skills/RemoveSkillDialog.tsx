import React, {
  FunctionComponent,
  useContext,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  Dialog, DialogActions,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useAuth} from '../../store/selectors';
import {
  useFirebase, useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { useTypedSelector } from '../../store';

interface EditSkillDialogProps {
  open: boolean;
  onClose: (remove: boolean) => void;
  skillKey: string;
}

//COMPONENT
const RemoveSkillDialog: FunctionComponent<EditSkillDialogProps> = (props: EditSkillDialogProps) => {
  const {
    open,
    onClose,
    skillKey,
  } = props;
  useAuth();
    useFirebase();
    const classes = useStyles();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect([{path:`skills/${character}/${skillKey}/name`, storeAs:`editSkill/${skillKey}/name`}]);
  const name = useTypedSelector(state => state.firebase.data?.editSkill?.[character]?.name) ?? ""

  const handleClose = async (remove?: boolean) => {
    onClose(remove ?? false);
  };


  return (
      <Dialog open={open}
              onClose={() => handleClose(false)}>
        {isLoaded(name)
         ? <> <DialogTitle>Remove {name ?? ""}?</DialogTitle>

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

export default RemoveSkillDialog;

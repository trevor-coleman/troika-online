import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useContext, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { GameContext } from '../../../contexts/GameContext';
import { useAuth } from '../../../store/selectors';
import Roll from '../Roll';

interface IRollDialogProps {
  parent: string;
  id: string;
  open: boolean;
  onClose?: ()=>void;
}

type RollDialogProps = PropsWithChildren<IRollDialogProps>

//COMPONENT
const RollDialog: FunctionComponent<RollDialogProps> = (props: RollDialogProps) => {
  const {
    open,
    parent,
    id,
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  const {lastRoll} = useContext(GameContext)
  const [lastSeen, setLastSeen] = useState("")

  function handleClose():void {
    setLastSeen(lastRoll?.key ?? "")
  }

  console.log("open", )
  return (
      <Dialog open={(
                        lastRoll && lastRoll?.key !== lastSeen) ?? false}
              maxWidth={"xs"}
              onClose={handleClose}
              fullWidth>
        <DialogTitle>{lastRoll?.value?.title ?? "Roll"}</DialogTitle>
        <DialogContent>
          {lastRoll ?
          <div>
            <Roll
              rollKey={lastRoll.key}
              roll={lastRoll} /></div> : <div/>
          }
          <Typography variant={'h6'}>{`Total: ${lastRoll?.value?.total ?? ""}`}</Typography>

        </DialogContent>


      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default RollDialog;

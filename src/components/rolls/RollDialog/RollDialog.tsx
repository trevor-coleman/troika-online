import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, {
  FunctionComponent, PropsWithChildren, useContext, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import {
  GameContext, IRollWeaponProps, RollProps,
} from '../../../contexts/GameContext';
import { useAuth } from '../../../store/selectors';
import Roll from '../Roll';

interface IRollDialogProps {
  parent: string;
  id: string;
  open: boolean;
  onClose?: () => void;
}

type RollDialogProps = PropsWithChildren<IRollDialogProps>

//COMPONENT
const RollDialog: FunctionComponent<RollDialogProps> = (props: RollDialogProps) => {
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  const {
    lastRoll,
    lastSeen,
    setLastSeen,
    roll,
  } = useContext(GameContext);

  const rollValue = lastRoll?.value ?? null;

  let key: string | undefined = lastRoll?.key;
  const shouldShow: boolean = (
                                  key !== lastSeen && lastSeen !==
                                  "firstOpen") ?? false;

  async function handleClose(rollDamage?: boolean): Promise<void> {
    console.log(key);
    setLastSeen(key ?? "");

    if (rollDamage && rollValue?.type === "weapon") {

      const {
        weaponKey,
        rolledWeapon,
        rollerName,
          rollerKey,
      } = rollValue;

      const snap = await firebase.ref(`/items/${rollerKey}/${weaponKey}/damage`)
                                 .once('value');
      const damage = snap.val() ?? [0, 0, 0, 0, 0, 0, 0];

      await roll({
        type        : 'damage',
        damage      : damage,
        dice        : [6],
        weaponKey,
        rollerKey,
        rolledWeapon,
        rollerName,
      });
    }
  }

  return (
      <Dialog
          open={shouldShow}
          maxWidth={"xs"}
          onClose={()=>handleClose()}
          fullWidth>
        <DialogTitle>{rollValue?.title ?? "Roll"}</DialogTitle>
        <DialogContent>
          <div>
            <Typography>{rollValue?.dialogDetail ?? ""}</Typography>
            {lastRoll
             ? <Roll
                 rollKey={key ?? ""}
                 roll={lastRoll} />
             : <div />}
          </div>
          <Result result={rollValue?.dialogResult ?? ""} />
        </DialogContent>
        <DialogActions><Button variant={"outlined"} onClick={()=>handleClose()}>Close</Button>
          {rollValue?.type==="weapon" ? <Button
              onClick={()=>handleClose(true)}
              variant={"contained"}
              color={"secondary"}>Roll Damage</Button> : ""
          }</DialogActions>


      </Dialog>);
};

const Result = ({result}: { result: string }) => {
  const [show, setShow] = useState(false);

  useEffect(
      () => {
        setShow(false);
        let timer1 = setTimeout(() => setShow(true), 750);

        // this will clear Timeout
        // when component unmount like in willComponentUnmount
        // and show will not change to true
        return () => {
          clearTimeout(timer1);
        };
      }, // useEffect will run only one time with empty []
      // if you pass a value to array,
      // like this - [data]
      // than clearTimeout will run every time
      // this value changes (useEffect re-run)
      []);

  return <Typography>{show
                      ? result
                      : "..."}</Typography>;
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default RollDialog;

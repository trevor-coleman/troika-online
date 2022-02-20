import {
    Card,
    Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, {
    FunctionComponent, PropsWithChildren, useContext, useEffect, useState,
} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useFirebase} from 'react-redux-firebase';
import {
    GameContext,
} from '../../../contexts/GameContext';
import {useAuth} from '../../../store/selectors';
import Roll from '../Roll';
import Box from "@material-ui/core/Box";
import DamageTable from "../../weapons/DamageTable";
import Grid from "@material-ui/core/Grid";

interface IRollDialogProps {
    parent: string;
    id: string;
    open: boolean;
    onClose?: () => void;
}

type RollDialogProps = PropsWithChildren<IRollDialogProps>

//COMPONENT
const RollDialog: FunctionComponent<RollDialogProps> = () => {
    useStyles();
    const firebase = useFirebase();
    useAuth();
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
                type: 'damage',
                damage: damage,
                dice: [6],
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
            onClose={() => handleClose()}
            fullWidth>
            <DialogTitle>{rollValue?.title ?? "Roll"}</DialogTitle>
            <DialogContent>
                <div>
                    <Typography>{rollValue?.dialogDetail ?? ""}</Typography>
                    {lastRoll
                        ? <Roll
                            rollKey={key ?? ""}
                            roll={lastRoll}/>
                        : <div/>}
                </div>
                <Result result={rollValue?.dialogResult ?? ""} damage={rollValue?.damage}/>
            </DialogContent>
            <DialogActions><Button variant={"outlined"} onClick={() => handleClose()}>Close</Button>
                {rollValue?.type === "weapon" ? <Button
                    onClick={() => handleClose(true)}
                    variant={"contained"}
                    color={"secondary"}>Roll Damage</Button> : ""
                }</DialogActions>


        </Dialog>);
};

const Result = ({result, damage}: { result: string, damage?: number[] }) => {
    const classes = useStyles();
    const [show, setShow] = useState(false);

    useEffect(
        () => {
            setShow(false);
            let timer1 = setTimeout(() => setShow(true), 750);

            return () => {
                clearTimeout(timer1);
            };
        },

        []);

    return <Box>
        {damage
            ? <Card>
                <Box p={1} m={1} className={classes.damageTableBox}>
                    <Grid container direction={"column"}>
                        <Grid item className={classes.damageTableLabelGridItem}>
                            <Typography className={classes.damageTableLabel} variant={"caption"}>Weapon Damage</Typography>
                        </Grid>
                        <Grid item>
                        <DamageTable damage={damage}/>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
            : <Box/>}
        <Box m={1} marginTop={damage ? 2 :1}><Typography>{show ? result : "..."}</Typography></Box>
    </Box>;
};


// const DamageTable = ({damage}:{damage:number[]})=>{
//   const classes = useStyles();
//   return (<Table size="small">
//     <TableBody>
//       <TableRow>
//         {[0, 0, 0, 0, 0, 0, 0]
//             .map((_, index) => {
//               const damageValue = damage?.[index] ?? 0
//               return (
//                   <TableCell
//                       padding={"none"}
//                       key={`damage-cell-${index}`}>
//                     <TextField
//                         disabled={true}
//                         InputLabelProps={{
//                           classes: {
//                             root: classes.damageRoot,
//                           },
//                         }}
//                         InputProps={{
//                           classes: {
//                             root: classes.damageRoot,
//                             input: classes.damageInput,
//                           },
//                         }}
//                         label={`${index + 1}${index == 6
//                             ? "+"
//                             : ""}`}
//                         variant={"outlined"}
//                         id={`damage-cell-${index}`}
//                         type={"number"}
//                         value={damageValue}/></TableCell>);
//             })}
//       </TableRow>
//     </TableBody>
//   </Table>)
// }


const useStyles = makeStyles((theme: Theme) => (
    {
        root: {},
        DamageSection: {},
        damageRoot: {
            marginTop: theme.spacing(1),
        },
        damageInput: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
            paddingLeft: 0,
            paddingRight: 0,
            textAlign: "center",
        },
        damageTableBox: {},
        damageTableLabel: {
            color: theme.palette.grey.A200,
            marginBottom: theme.spacing(1)
        },
        damageTableLabelGridItem:{
            paddingBottom: theme.spacing(1)
        }
    }));

export default RollDialog;

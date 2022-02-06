import React, {ChangeEvent, FunctionComponent, PropsWithChildren, useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';
import {useAuth, useMonies, useProvisions} from '../../store/selectors';
import {useCharacter} from "../../store/selectors";
import {CharacterContext} from "../../contexts/CharacterContext";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";

interface IMoniesAndProvisionsProps {
}

type MoniesAndProvisionsProps = PropsWithChildren<IMoniesAndProvisionsProps>

//COMPONENT
const MoniesAndProvisions: FunctionComponent<MoniesAndProvisionsProps> = (props: MoniesAndProvisionsProps) => {
    const classes = useStyles();
    const firebase = useFirebase();
    const auth = useAuth();
    const {character, editable} = useContext(CharacterContext);

    useFirebaseConnect([
        {
            path: `/characters/${character}/monies`,
            storeAs: `characterSkills/${character}/monies`,
        },
        {
            path: `/characters/${character}/provisions`,
            storeAs: `characterSkills/${character}/provisions`,
        },
    ]);

    const monies = useMonies(character);
    const provisions = useProvisions(character);

    const [values, setValues] = useState({
        monies, provisions
    });

    function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {

        setValues({
            ...values,
            [e.target.id]: parseInt(e.target.value),
        });

        firebase.ref(`/characters/${character}/${e.target.id}`)
            .set(parseInt(e.target.value == ""
                ? "0"
                : e.target.value));
    }


    return (
        <Grid container className={classes.root}>
            <Grid
                item
                xs={6}
                className={classes.gridItem}>
                <Typography>Monies</Typography>
                <TextField
                    value={monies}
                    id={"monies"}
                    variant={"outlined"}
                    disabled={!editable}
                    type={"number"}
                    className={classes.textField}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.inputProps,
                        },
                    }}/>

                <div className={"dummy"}/>
            </Grid>
            <Grid
                container
                item
                xs={6}
                className={classes.gridItem}>
                <Grid item><Typography>Provisions</Typography></Grid>
                <Grid container item spacing={1} direction={"row"} className={classes.provisionsRow}>
                    <Grid item >
                        <TextField
                            value={provisions}
                            id={"provisions"}
                            variant={"outlined"}
                            disabled={!editable}
                            type={"number"}
                            className={classes.textField}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                classes: {
                                    input: classes.inputProps,
                                },
                            }}/>
                    </Grid>
                    <Grid item className={classes.eatButtonContainer}><Button variant={"contained"} color={"primary"} className={classes.eatButton}>Eat</Button></Grid>
                </Grid>
            <div className={"dummy"}/>
        </Grid>
</Grid>)

};

const useStyles = makeStyles((theme: Theme) => (
    {
        root: {
            padding: theme.spacing(2)
        },
        gridItem: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent:"flex-start"
        },
        textField: {},
        inputProps: {
            textAlign: "center",
            fontSize: "1.5rem",
        },
        provisionsRow: {
            alignItems:"center",
            justifyContent:"center",
        },
        eatButton:{
            height: theme.spacing(6)
        },
        eatButtonContainer:{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            height: theme.spacing(6)
        }

    }));

export default MoniesAndProvisions;

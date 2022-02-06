import React, {ChangeEvent, FunctionComponent, PropsWithChildren, useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';
import {useAuth, useMaxStamina, useMonies, useProvisions, useStamina} from '../../store/selectors';
import {useCharacter} from "../../store/selectors";
import {CharacterContext} from "../../contexts/CharacterContext";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";
import {GameContext} from "../../contexts/GameContext";

interface IMoniesAndProvisionsProps {
}

type MoniesAndProvisionsProps = PropsWithChildren<IMoniesAndProvisionsProps>

//COMPONENT
const MoniesAndProvisions: FunctionComponent<MoniesAndProvisionsProps> = (props: MoniesAndProvisionsProps) => {
    const classes = useStyles();
    const firebase = useFirebase();
    const auth = useAuth();
    const {character, editable} = useContext(CharacterContext);
    const {roll} = useContext(GameContext);
    const {name} = useCharacter(character) ?? {};
    const monies = useMonies(character);
    const provisions = useProvisions(character);
    const currentStamina = useStamina(character);
    const maxStamina = useMaxStamina(character);

    useFirebaseConnect([
        {
            path: `/characters/${character}/stamina_current`,
            storeAs: `characterSkills/${character}/stamina_current`,
        }, {
            path: `/characters/${character}/stamina_max`,
            storeAs: `characterSkills/${character}/stamina_max`,
        },
        {
            path: `/characters/${character}/monies`,
            storeAs: `characterSkills/${character}/monies`,
        },
        {
            path: `/characters/${character}/provisions`,
            storeAs: `characterSkills/${character}/provisions`,
        },
    ]);



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

    async function eatProvision() {
        const dice = [6];

        const result = await roll({
            type: 'provisions',
            rollerKey: character,
            dice: dice,
            rollerName: name ?? "Someone",
            currentProvisions: provisions,
            currentStamina,
            maxStamina
        });
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
                    <Grid item>
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
                    <Grid item className={classes.eatButtonContainer}>
                        <Button onClick={eatProvision} variant={"contained"} color={"primary"}
                                className={classes.eatButton}>Eat</Button>
                    </Grid>
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
            justifyContent: "flex-start"
        },
        textField: {},
        inputProps: {
            textAlign: "center",
            fontSize: "1.5rem",
        },
        provisionsRow: {
            alignItems: "center",
            justifyContent: "center",
        },
        eatButton: {
            height: theme.spacing(6)
        },
        eatButtonContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: theme.spacing(6)
        }

    }));

export default MoniesAndProvisions;

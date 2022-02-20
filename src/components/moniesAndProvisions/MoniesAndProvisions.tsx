import React, {ChangeEvent, FunctionComponent, PropsWithChildren, useContext, useState} from 'react';
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
const MoniesAndProvisions: FunctionComponent<MoniesAndProvisionsProps> = () => {
    const classes = useStyles();
    const firebase = useFirebase();
    useAuth();
    const {character, editable} = useContext(CharacterContext);
    const {roll} = useContext(GameContext);
    const {name} = useCharacter(character) ?? {};
    const monies = useMonies(character);
    const provisions = useProvisions(character);
    const currentStamina = useStamina(character);
    const maxStamina = useMaxStamina(character);

    useFirebaseConnect([
        `/baseStats/${character}/stamina_current`,
        `/baseStats/${character}/stamina_max`,
        `/moniesAndProvisions/${character}/monies`,
        `/moniesAndProvisions/${character}/provisions`,
    ]);



    const [values, setValues] = useState({
        monies, provisions
    });

    async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): Promise<any> {

        const newValue = Math.max(parseInt(e.target.value ?? "0"), 0)

        setValues({
            ...values,
            [e.target.id]: newValue,
        });

        await firebase.ref(`/moniesAndProvisions/${character}/${e.target.id}`)
            .set(newValue);
    }

    async function eatProvision() {
        const dice = [6];

        await roll({
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
                    <Grid item xs={9}>
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
                    <Grid item xs={3} className={classes.eatButtonContainer}>
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

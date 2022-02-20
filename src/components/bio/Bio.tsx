import React, {ChangeEvent, useState, useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {CircularProgress, FormControl, InputLabel, Paper, TextareaAutosize} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {CharacterContext} from '../../contexts/CharacterContext';
import {useCharacterBackground, useCharacterName, useCharacterSpecial} from '../../store/selectors';
import {
    useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import DragAndDropPortrait from './DragAndDropPortrait';

interface BioAndInfoProps {

}


//COMPONENT
const Bio = () => {
    const classes = useStyles();
    const {character: characterKey, editable} = useContext(CharacterContext);
    useFirebaseConnect([
        {path: `/bios/${characterKey}/name`, storeAs: `/bios/${characterKey}/name`},
        {path: `/bios/${characterKey}/background`, storeAs: `/bios/${characterKey}/background`},
        {path: `/bios/${characterKey}/special`, storeAs: `/bios/${characterKey}/special`},
    ]);

    const [specialState, setSpecialState] = useState({
        focused: false, shrink: false
    });

    const name = useCharacterName(characterKey)
    const special = useCharacterSpecial(characterKey);
    const background = useCharacterBackground(characterKey);
    const firebase = useFirebase();

    const updateDatabase = async (id: string, value: string) => {
        await firebase.ref(`/bios/${characterKey}`).update({
            [id]: value,
        });
    };

    const handleChange = async (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): Promise<void> => {
        if (e.target.id === "special") {
            setSpecialValue(e.target.value);
            if (specialState.shrink !== Boolean(e.target.value)) {
                setSpecialState({
                    ...specialState,
                    shrink: specialState.focused || Boolean(e.target.value)
                })
            }
        }

        await updateDatabase(e.target.id, e.target.value);
    };

    const [specialValue, setSpecialValue] = useState(special);
    const fullyLoaded = isLoaded(`bios/${characterKey}/name`)
        && isLoaded(`bios/${characterKey}/special`)
        && isLoaded(`bios/${characterKey}/background`)
        && isLoaded(`portraits/${characterKey}/portrait`);

    return (
        <div>
            <Paper>
                {fullyLoaded ? <Box p={2}>
                    <form noValidate
                          autoComplete={"off"}>
                        <Grid container
                              spacing={2}>
                            <Grid container
                                  item
                                  xs={12}
                                  sm={4}
                                  md={3}
                                  alignItems={"flex-start"}
                                  justify={"center"}>

                                <DragAndDropPortrait
                                    alt={name ?? "avatar placeholder"}/>
                                
                            </Grid>
                            <Grid item
                                  container
                                  xs={12}
                                  sm={8}
                                  md={6}
                                  direction={"row"}
                                  spacing={2}>
                                <Grid item
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={6}>
                                    <TextField label={"name"}
                                               disabled={!editable}
                                               variant={"outlined"}
                                               fullWidth
                                               id={"name"}
                                               value={name ?? ""}
                                               onChange={handleChange}/>
                                </Grid>
                                <Grid item
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={6}

                                >
                                    <TextField label={"Background"}
                                               disabled={!editable}
                                               variant={"outlined"}
                                               fullWidth
                                               id={"background"}
                                               value={background ?? ""}
                                               onChange={handleChange}/>
                                </Grid>
                                <Grid item
                                      xs={12}
                                      md={12}
                                      className={classes.specialGrid}
                                >
                                    <FormControl focused={specialState.focused} fullWidth>
                                        <InputLabel className={classes.inputLabel} shrink={specialState.shrink}
                                                    variant={"outlined"}>Special</InputLabel>
                                        <TextareaAutosize
                                            // label={"Special"}
                                            disabled={!editable}
                                            rows={4}
                                            id={"special"}
                                            value={specialValue ?? ""}
                                            className={classes.autoResizeTextArea}
                                            onChange={handleChange}
                                            onFocus={() => setSpecialState({
                                                shrink: true,
                                                focused: true
                                            })}
                                            onBlur={() => setSpecialState({
                                                shrink: Boolean(special),
                                                focused: false
                                            })}
                                        />

                                    </FormControl>

                                </Grid>
                            </Grid></Grid>
                    </form>
                </Box> : <Box><CircularProgress/></Box>
                }</Paper>
        </div>);
};

// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles((theme: Theme) => (
    {
        root: {},
        autoResizeTextArea: {
            fontFamily: theme.typography.fontFamily,
            fontSize: "1rem",
            padding: theme.spacing(2),
            width: "100%",
            borderRadius: theme.shape.borderRadius,
            marginRight: theme.spacing(1),
            borderColor: theme.palette.grey.A100,
            position: "relative",
            zIndex: 0,
        },
        specialLabel: {
            fontSize: "0.75rem",
            lineHeight: 1
        },
        specialLabelContainer: {
            position: "absolute",
            left: theme.spacing(1),
            top: 0,
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            paddingHorizontal: theme.spacing(1),
            paddingVertical: 2,
            border: "1px dashed magenta"


        },
        specialGrid: {
            position: "relative"
        },
        inputLabel: {
            backgroundColor: theme.palette.background.paper,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            display: "block",
        }

    }));

export default Bio;

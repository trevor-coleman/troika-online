import React, {ChangeEvent, useState, useEffect, useContext, useMemo} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {FormControl, InputLabel, Paper, TextareaAutosize} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {CharacterContext} from '../../contexts/CharacterContext';
import {Character} from '../../store/Schema';
import {useCharacter} from '../../store/selectors';
import {blankCharacter} from '../../store/templates';
import {
    useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import DragAndDropPortrait from './DragAndDropPortrait';
import {useTypedSelector} from '../../store';
import {Popper} from '@material-ui/core';
import debounce from "lodash/debounce";

interface BioAndInfoProps {

}

let timer;

//COMPONENT
const Bio = (props: BioAndInfoProps) => {
    const classes = useStyles();
    const {character: characterKey, editable} = useContext(CharacterContext);
    useFirebaseConnect([
        {path: `/characters/${characterKey}/name`, storeAs: `/bio/${characterKey}/name`},
        {path: `/characters/${characterKey}/background`, storeAs: `/bio/${characterKey}/background`},
        {path: `/characters/${characterKey}/special`, storeAs: `/bio/${characterKey}/special`},
    ]);

    const [specialState, setSpecialState] = useState({
        focused: false, shrink: false
    });

    const name = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.name);
    const special = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.special);
    const background = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.background);
    const firebase = useFirebase();

    const updateDatabase = useMemo(()=>debounce((id, value)=>{
        firebase.ref(`/characters/${characterKey}`).update({
            [id]: value,
        });
    }, 500),[characterKey, firebase, debounce])

    const handleChange = async (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): Promise<void> => {
        setSpecialValue(e.target.value);
        if (e.target.id === "special" && specialState.shrink !== Boolean(e.target.value)) {
            console.log("handleChange - UpdatingSpecialState")
            setSpecialState({
                ...specialState,
                shrink: specialState.focused || Boolean(e.target.value)
            })
        }

        updateDatabase(e.target.id, e.target.value);
    };

    const [specialValue, setSpecialValue] = useState(special);
    console.log("specialValue", specialValue);


    return (
        <div>
            <Paper>
                <Box p={2}>
                    <form noValidate
                          autoComplete={"off"}>
                        <Grid container
                              spacing={2}>
                            <Grid container
                                  item
                                  xs={12}
                                  sm={4}
                                  md={3}
                                  alignItems={"center"}
                                  justify={"center"}>
                                <Grid item><DragAndDropPortrait alt={name ??
                                    "avatar placeholder"}/></Grid>
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
                </Box></Paper>
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

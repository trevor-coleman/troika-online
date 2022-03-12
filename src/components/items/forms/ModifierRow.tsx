import React, {useContext, useEffect, useState} from 'react';
import {CharacterContext} from "../../../contexts/CharacterContext";
import {ItemContext} from "../../../contexts/ItemContext";
import {useCharacterModifier, useCharacterSkillNames, useItemModifier} from '../../../store/selectors';
import Grid from "@material-ui/core/Grid";
import {FormControl, FormControlLabel, FormGroup, MenuItem, Select, Switch, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useFirebase} from "react-redux-firebase";
import IconButton from "@material-ui/core/IconButton";
import {DeleteOutline as DeleteOutlineIcon} from "@material-ui/icons";

interface ModifierRowProps {
    modifier: string
}

export function ModifierRow({modifier}: ModifierRowProps) {
    const firebase = useFirebase();
    const {character, editable} = useContext(CharacterContext);
    const skillList = useCharacterSkillNames(character);
    const selectOptions = skillList ?? ["no options"];
    const modifierData = useCharacterModifier(character, modifier) ?? {}
    const {skill = "", delta = 0, onlyWhenEquipped = false} = modifierData;

    const [active, setActive] = useState(onlyWhenEquipped ? "equipped" : "passive")

    const classes = useStyles();

    const modifierRef = firebase.ref(`/modifiers/${character}/${modifier}`);
    const handleAmountChanged = async ({target:{value}}: any) => {
        try {
            const newValue = parseInt(value.toString())
            setAmount(newValue);
            await modifierRef.update({delta: newValue});
        } catch {
            console.error("Failed to update Bonus/Penalty");
        }
    };

    const handleSkillChange = (e:any) => {
        modifierRef.update({skill:e.target.value});
    }

    const handleDeleteModifier = ()=>{
        firebase.ref(`/modifiers/${character}/${modifier}`).set(null);
    }

    const handleActiveChange = ({target:{value}}:any)=>{
        setActive(value)
        const onlyWhenEquipped = value === "equipped";
        firebase.ref(`/modifiers/${character}/${modifier}`).update({onlyWhenEquipped});
    }

    const [amount, setAmount] = useState(delta);

    useEffect(() => {
        if (amount !== delta) {
            setAmount(delta)
        }
    }, [delta, amount])


    const [selected, setSelected] = useState(skill ?? "");

    return (<Grid item container direction={"row"}
                  xs={12}>
        <Grid item xs={8}>
        <FormGroup row>
            <FormControl disabled={!editable}
                         className={classes.selectControl}>
                <Select variant={"outlined"}
                        id={"protection"}
                        value={skill ?? ""}
                        name={"protection"}
                        onChange={handleSkillChange}
                >
                    {selectOptions.map((item, index) =>
                        <MenuItem key={`select-modifiedSkill-${selected}-${index}`}
                                  value={item.id}>
                            {`${item.name}`}
                        </MenuItem>)}
                </Select>
            </FormControl>
            <TextField disabled={false}
                       variant={"outlined"}
                       label={"Bonus / Penalty"}
                       type={"number"}
                       value={amount}
                       onChange={handleAmountChanged}/>
        </FormGroup>
        </Grid>
        <Grid item xs={3}>
            <Select
            fullWidth
                variant={"outlined"}
                    id={"protection"}
                    value={active}
                    name={"protection"}
                    onChange={handleActiveChange}
            >
                <MenuItem value={"equipped"}> when equipped </MenuItem>
                <MenuItem value={"passive"}> always on </MenuItem>

            </Select>
        </Grid>
        <Grid item xs={1}>
            <IconButton onClick={handleDeleteModifier}>
                <DeleteOutlineIcon/>
            </IconButton>
        </Grid>

    </Grid>)
}

const useStyles = makeStyles(() => (
    {
        selectControl: {
            flexGrow: 1,
        },
    }));

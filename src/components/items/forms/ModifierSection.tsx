import React, {
    FunctionComponent,
    ChangeEvent,
    useState, useContext,
} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {
    FormControlLabel, Switch, FormControl, Select, MenuItem, TextField, FormGroup,
} from '@material-ui/core';
import {CharacterContext} from '../../../contexts/CharacterContext';
import {FormValueChangeHandler} from './FormValueChange';
import {useFirebaseConnect} from 'react-redux-firebase';
import {useTypedSelector} from '../../../store';
import {useCharacterSkillNames} from "../../../store/selectors";
import {ItemContext} from "../../../contexts/ItemContext";


interface IModifierSectionProps {
    onChange: FormValueChangeHandler,
}

const useStyles = makeStyles(() => (
    {
        ModifierSection: {},
        selectControl: {
            flexGrow: 1,
        },
    }));

const ModifierSection: FunctionComponent<IModifierSectionProps> = ({onChange}: IModifierSectionProps) => {
    const {character, editable} = useContext(CharacterContext);
    const item = useContext(ItemContext);
    const classes = useStyles();
    const [isTooHigh, setIsTooHigh] = useState(false);

    useFirebaseConnect([
        `/characters/${character}/skillList`,
        `/skills/${character}`,
        `/modifiers/${item}`
    ])

    const skillList = useCharacterSkillNames(character);

    const [selected, setSelected] = useState<string>(skillList[0]);

    const selectOptions = skillList;


    let handleEnabled: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
        onChange([
            {
                id: "modifies",
                value: e.target.checked,
            },
        ]);
    };



    return (
        <Grid container direction={"row"}><Grid item
                                                xs={3}>
            <FormControlLabel labelPlacement={"start"}
                              control={<Switch
                                  disabled={!editable}
                                  checked={false}
                                  onChange={handleEnabled}
                                  id={"item-protects"}
                                  name="item-protects"/>}
                              label={"Modifier"}/>
        </Grid>
            <Grid item
                  xs={9}>
                <FormGroup row><FormControl disabled={!editable}
                                            className={classes.selectControl}>
                    <Select variant={"outlined"}
                            id={"protection"}
                            value={selected ?? 0}
                            name={"protection"}
                            onChange={()=>{}}>
                        {selectOptions.map((item, index) =>
                            <MenuItem key={`select-protection-${selected}-${index}`}
                                      value={-index}>{`${item}`}</MenuItem>)}
                        <MenuItem value={1}>Custom</MenuItem>
                    </Select>
                </FormControl>
                    <TextField disabled={false}
                               error={isTooHigh}
                               variant={"outlined"}
                               label={isTooHigh ? "Negative Values Only" : "Damage Reduction"}
                               type={"number"}
                               value={0}
                               onChange={()=>{}}/>
                </FormGroup>
            </Grid></Grid>);
};

export default ModifierSection;

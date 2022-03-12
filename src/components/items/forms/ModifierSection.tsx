import React, {ChangeEvent, FunctionComponent, useContext, useEffect, useState,} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {FormControlLabel, Switch,} from '@material-ui/core';
import {CharacterContext} from '../../../contexts/CharacterContext';
import {FormValueChangeHandler} from './FormValueChange';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';
import {useCharacterSkillNames, useItemEffects, useItemModifiers} from '../../../store/selectors';
import {ItemContext} from "../../../contexts/ItemContext";
import {ModifierRow} from "./ModifierRow";
import Button from "@material-ui/core/Button";
import {Modifier} from "../../../store/Schema";
import firebase from "firebase/app";


interface IModifierSectionProps {
    onChange: FormValueChangeHandler,
    sectionId: string,
}

const ModifierSection: FunctionComponent<IModifierSectionProps> = ({onChange, sectionId}: IModifierSectionProps) => {
    const {character} = useContext(CharacterContext);
    const firebase = useFirebase();
    const item = useContext(ItemContext);
    useFirebaseConnect([
        `/characters/${character}/skillList`,
        `/skills/${character}`,
        `/modifiers/${character}`,
        {path: `/modifiers/${character}`, queryParams: [`orderByChild=parent`, `equalTo=${item}`], storeAs: `/itemModifiers/${item}`, type:'value'},
        {path: `/effects/${character}`, queryParams: [`orderByChild=parent`, `equalTo=${item}`]},
    ], )

    const modifiers = useItemModifiers(item);

    console.log({modifiers});

    const createModifier = ()=>{
        const blankModifier:Modifier = {delta: 0, onlyWhenEquipped: true, parent: item, skill: "", character}
        const modifiersRef = firebase.ref(`/modifiers/${character}`);
        const newKey = modifiersRef.push().key;
        if(!newKey) throw new Error("Missing key when creating new modifier");
        modifiersRef.child(newKey).set(blankModifier);
    }

    return (<Grid container spacing={2} direction={"column"}>
        {modifiers.map(modifier => <ModifierRow key={modifier} modifier={modifier}/>)}
        <Button onClick={createModifier}>Add Modifier</Button>
        </Grid>);
};

export default ModifierSection;


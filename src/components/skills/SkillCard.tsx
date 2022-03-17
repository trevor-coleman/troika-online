import {Checkbox, SvgIcon, Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Edit} from '@material-ui/icons';
import React, {FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';
import {CharacterContext} from '../../contexts/CharacterContext';
import {GameContext} from '../../contexts/GameContext';
import {useTypedSelector} from '../../store';
import {useAuth, useCharacterName, useEquippedItems, useStamina} from '../../store/selectors';
import {SkillContext} from './context/SkillContext';
import {ReactComponent as MagicWandIcon} from './magic-wand-svgrepo-com.svg';
import SkillInfoPopperContent from './SkillInfoPopperContent';
import SkillInfoButton from './skillSections/SkillInfoButton';
import SkillValueBoxes from './skillSections/SkillValueBoxes';


interface ISkillCardProps {
    skill: string,
    onEdit: (key: string) => void,
    onRemove: (key: string) => void,
}

const SkillCard: FunctionComponent<ISkillCardProps> = (props: ISkillCardProps) => {
    const {
        skill,
        onEdit,

    } = props;
    const {character, editable} = useContext(CharacterContext);
    const {roll} = useContext(GameContext);
    const classes = useStyles();
    const firebase = useFirebase();
    useAuth();

    useFirebaseConnect([
        `/skillValues/${character}/${skill}`,
        `/baseStats/${character}/skill`,

        {
            path: `/skills/${character}/${skill}/name`,
            storeAs: `/skillTableRow/${character}/${skill}/name`,
        }, {
            path: `/skills/${character}/${skill}/isSpell`,
            storeAs: `/skillTableRow/${character}/${skill}/isSpell`,
        }, {
            path: `/skills/${character}/${skill}/staminaCost`,
            storeAs: `/skillTableRow/${character}/${skill}/staminaCost`,
        }, {
            path: `/skills/${character}/${skill}/used`,
            storeAs: `/skillTableRow/${character}/${skill}/used`,
        }, {
            path: `/bios/${character}/name`,
        }, {
            path: `/baseStats/${character}`,
        },
        {
            path: `/modifiers/${character}`,
            queryParams: [`orderByChild=skill`, `equalTo=${skill}`],
            storeAs: `skillModifiers/${skill}`
        },
        {
            path: `/equippedItems/${character}`,
        },
    ]);


    const stamina = useStamina(character);
    const characterName = useCharacterName(character);


    const used = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.used) ?? false;

    const name = skill == 'unarmed'
                 ? 'Unarmed'
                 : useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.name) ??
                   '';

    const rank = useTypedSelector(state => state.firebase.data?.skillValues?.[character]?.[skill]?.rank) ??
                 0;
    const skillStat = useTypedSelector(state => state.firebase.data?.baseStats?.[character]?.skill) ??
                      0;

    const staminaCost = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.staminaCost) ??
                        0;
    const isSpell = useTypedSelector(state => state.firebase.data?.skillTableRow?.[character]?.[skill]?.isSpell) ??
                    false;
    const skillModifiers = useTypedSelector(state => state.firebase.data?.skillModifiers?.[skill]) ?? {};
    const equippedItems = useEquippedItems(character);
    const modifierDelta = useTypedSelector(state=>{
        const skillModifiers = state.firebase.data?.skillModifiers?.[skill];

        if (!skillModifiers) return 0;

        const modifierDeltas = Object
            .values(skillModifiers)
            .filter((modifier) => {

                const {skill: modifierSkill, onlyWhenEquipped, parent} = modifier

                if (onlyWhenEquipped && !equippedItems[parent]) {

                    return 0;
                }
                return skill ===
                       modifierSkill;
            }).map(
                ({onlyWhenEquipped, parent, delta}) => {

                    return onlyWhenEquipped && !equippedItems[parent] ? 0 : delta;
                });
        const newDelta = modifierDeltas.reduce((prev, curr) => prev + curr, 0)

        return newDelta;
    })

    const [delta, setDelta] = useState(0);

    useEffect(() => {
        // const modifierDeltas = Object
        //     .values(skillModifiers)
        //     .filter((modifier) => {
        //         console.log(modifier);
        //         const {skill: modifierSkill, onlyWhenEquipped, parent} = modifier
        //         console.log(onlyWhenEquipped)
        //         if (onlyWhenEquipped && !equippedItems[parent]) {
        //             console.log("not equipped");
        //             return 0;}
        //         return skill ===
        //                modifierSkill;
        //     }).map(
        //         ({onlyWhenEquipped, parent, delta}) => {
        //             console.log({onlyWhenEquipped, parent, delta});
        //             return onlyWhenEquipped && !equippedItems[parent] ? 0 : delta;
        //         });
        // const newDelta = modifierDeltas.reduce((prev, curr) => prev + curr, 0)
        if(delta !== modifierDelta) {
            setDelta(modifierDelta);
        }
    }, [delta, modifierDelta])

    const [expand, setExpand] = useState(false);

    useCallback(() => {
        setExpand(!expand);
    }, [expand]);

    async function handleUsed(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        if (skill == 'unarmed') return;
        const newValue = e.target.checked;
        await firebase.ref(`/skills/${character}/${skill}/used`).set(newValue ?? false);
    }

    const rollSkill = useCallback(async () => {
        if (isSpell) {
            await firebase.ref(`/baseStats/${character}/stamina_current`).set(stamina - staminaCost);
            await roll({
                type: 'spell',
                dice: [6, 6],
                rolledSkill: name,
                rollerKey: character,
                rollerName: characterName,
                target: rank + skillStat,
                delta,
            });
            return;
        }

        await roll({
            type: 'skill',
            dice: [6, 6],
            rolledSkill: name,
            rollerKey: character,
            rollerName: characterName,
            target: rank + skillStat,
            delta,
        });

    }, [delta, name, character, characterName, rank, skillStat, isSpell, stamina, staminaCost ])

    return (
        <SkillContext.Provider value={skill}>
            <Grid
                container
                className={classes.SkillCard}>
                <Grid
                    item
                    xs={12}
                    container>
                    {/*Checkbox*/}
                    <Grid
                        item
                        xs={1}
                        container
                        alignItems={'center'}
                        justify={'center'}>
                        <div>
                            <Checkbox
                                disabled={skill == 'unarmed' || !editable}
                                className={classes.checkBox}
                                checked={used}
                                onChange={handleUsed}
                                size={'small'}/></div>
                    </Grid>
                    {/*Name*/}
                    <Grid
                        item
                        container
                        xs={3}
                        alignItems={'center'}
                        justify={'flex-start'}>
                        <Tooltip disableHoverListener={staminaCost <= stamina} title={'Stamina too low'}><Grid item>
                            <Button color={'primary'} classes={{
                                text: classes.skillNameButtonText,
                            }} disabled={staminaCost > stamina || !editable} onClick={rollSkill} endIcon={isSpell
                                                                                                          ?
                                                                                                          <SvgIcon><MagicWandIcon/></SvgIcon>
                                                                                                          : undefined}>{name +
                                                                                                                        (isSpell
                                                                                                                         ? ` (${staminaCost})`
                                                                                                                         : '')}</Button>
                        </Grid></Tooltip>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={1}
                        alignItems={'center'}
                        justify={'center'}>
                        <Grid item><SkillInfoButton><SkillInfoPopperContent/></SkillInfoButton></Grid>
                    </Grid>
                    {/*Fields*/}
                    <Grid
                        item
                        container
                        xs={5}
                        alignItems={'center'}
                        justify={'center'}
                    >
                        <SkillValueBoxes unarmed={skill == 'unarmed'} delta={delta}/>
                    </Grid>
                    {/*Button*/}
                    <Grid
                        item
                        container
                        xs={2}
                        alignItems={'center'}
                        justify={'center'}
                        spacing={1}
                    >
                        <Grid item><Button
                            disabled={skill == 'unarmed' || !editable}
                            variant="contained"
                            fullWidth
                            onClick={() => onEdit(skill)}>
                            <Edit/>
                        </Button></Grid>
                    </Grid>
                </Grid>

            </Grid>
        </SkillContext.Provider>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
        checkBox: {
            padding: theme.spacing(2),
        },
        usedLabel: {
            fontSize: theme.typography.fontSize - 3,
        },
        collapseRoot: {
            flexGrow: 1,
            hyphens: 'auto',
            whiteSpace: 'normal',
            maxWidth: '100%',
        },
        collapse: {
            flexGrow: 1,
            width: '100%',
        },
        SkillCard: {
            backgroundColor: theme.palette.background.paper,
        },
        skillNameButtonText: {
            textAlign: 'left',
        },

        expandButton: {},

        name: {},
    }));
export default SkillCard;

import Grid from '@material-ui/core/Grid';
import React, {FunctionComponent} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {useFirebase} from 'react-redux-firebase';
import {rollKey} from '../components/rolls/rollKey';
import {Item} from '../store/Item';

interface AdminProps {
}

//COMPONENT
const Admin: FunctionComponent<AdminProps> = (props: AdminProps) => {
    const {} = props;
    const classes = useStyles();
    const firebase = useFirebase();

    async function testDice() {

        const result: { [key: number]: number } = {};
        for (let i = 0; i < 100; i++) {
            if (i % 100 == 0) console.log(i);
            const ref = await firebase.ref(`/diceTest`)
                .push();
            const roll = rollKey(ref?.key ?? "someKey", [6, 6]);
            // const roll = [Math.floor(Math.random()* 6)+1,
            //               Math.floor(Math.random() * 6) + 1]
            const total = roll.reduce((
                (previousValue, currentValue) => previousValue + currentValue));
            if (!result[total]) {
                result[total] = 1;
            } else {
                result[total]++;
            }
        }


    }

    async function srdSkillSortNames() {
        const srdSkillsSnap = await firebase.ref('/srdSkills')
            .orderByKey()
            .once('value');

        const srdSkills = srdSkillsSnap.val();

        const result: { [key: string]: any } = {};
        Object.keys(srdSkills)
            .forEach(key => {
                result[key] = {
                    ...srdSkills[key],
                    sort_name: srdSkills[key].name.toLowerCase(),
                };
            });

        await firebase.ref('/srdSkills')
            .set(result);

        // const processedSkills = srdSkillsSnap.val().map((item:Skill)=>{
        //   return {
        //     ...item,
        //     sort_name: item.name.toLowerCase()
        //   }
        // })

    }

    interface BioInfo {
        name: string,
        background: string,
        special: string,
    }

    async function normalizeBios() {
        const charactersSnap = await firebase.ref('/characters').once('value');

        const characters = charactersSnap.val();

        const bios: Record<string, BioInfo> = {};

        for (const characterKey in characters) {

            const {special = "", name = "", background = ""} = characters[characterKey];

            bios[characterKey] = {
                special, name, background,
            }
        }

        console.log(bios);
        const biosRef = firebase.ref("/bios")

        await biosRef.update(bios)
    }

    type BaseStat = "luck_current" | "luck_max" | "stamina_current" | "stamina_max" | "skill";
    type BaseStats = Record<BaseStat, number>

    async function normalizeStats() {
        const charactersSnapshot = await firebase.ref('/characters').once('value');

        const characters = charactersSnapshot.val();

        const baseStats: Record<string, BaseStats> = {};

        for (const characterKey in characters) {

            const {
                luck_current = 0,
                luck_max = 0,
                stamina_current = 0,
                stamina_max = 0,
                skill = 0
            } = characters[characterKey];

            baseStats[characterKey] = {
                luck_current, luck_max, skill, stamina_current, stamina_max

            }
        }


        const baseStatsRef = firebase.ref("/baseStats")

        await baseStatsRef.update(baseStats)
    }

    interface MoniesAndProvisions {
        monies:number,
        provisions: number,
    }

    async function normalizeMoniesAndProvisions() {
        const charactersSnapshot = await firebase.ref('/characters').once('value');

        const characters = charactersSnapshot.val();

        const moniesAndProvisions: Record<string, MoniesAndProvisions> = {};

        for (const characterKey in characters) {

            const {
                monies=0, provisions=0
            } = characters[characterKey];

            moniesAndProvisions[characterKey] = {
                monies, provisions
            }
        }


        const ref = firebase.ref("/moniesAndProvisions")

        await ref.update(moniesAndProvisions)
    }

    async function normalizePortraits() {
        const charactersSnapshot = await firebase.ref('/characters').once('value');

        const characters = charactersSnapshot.val();

        const result: Record<string, any> = {};

        for (const characterKey in characters) {

            const {
                portrait = null,
                portraits = null,
            } = characters[characterKey];

            result[characterKey] = {
                portrait,
                portraits
            }
        }

        console.log(result);
        const ref = firebase.ref("/portraits")

        await ref.update(result)
    }

    async function moveSRD() {
        const srdItemsSnap = await firebase.ref('/srdItems')
            .once('value');
        const srdSkillsSnap = await firebase.ref('/srdSkills')
            .once('value');
        const items = srdItemsSnap.val();
        const skills = srdSkillsSnap.val();

        const itemsUpdate = Object.keys(items)
            .reduce<{ [key: string]: Item }>((
                (previousValue, currentValue) => {
                    return {
                        ...previousValue,
                        [currentValue]: {
                            ...items[currentValue],
                            sort_name: items[currentValue].name.toLowerCase(),
                        },
                    };
                }), {});

        const skillsUpdate = Object.keys(skills)
            .reduce<{ [key: string]: Item }>((
                (previousValue, currentValue) => {
                    return {
                        ...previousValue,
                        [currentValue]: {
                            ...skills[currentValue],
                            sort_name: skills[currentValue].name.toLowerCase(),
                        },
                    };
                }), {});

        await firebase.ref(`srdSkills`)
            .update(skillsUpdate);
        await firebase.ref('srdItems')
            .update(itemsUpdate);

    }

    return (
        <div className={classes.root}>
            <Typography variant={"h1"}>Admin</Typography>
            <Paper><Box p={2}>
                <Grid container direction={"column"} spacing={2}>
                    <Grid item
                          container
                          spacing={2}>
                        <Grid item>
                            <Button
                                disabled
                                variant={"contained"}
                                onClick={moveSRD}> MoveSRD</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled
                                variant={"contained"}

                                onClick={srdSkillSortNames}>srdSkillSortNames</Button>
                        </Grid>
                        <Grid item>
                            <Button

                                variant={"contained"}
                                onClick={testDice}>test dice</Button>
                        </Grid>
                    </Grid>
                    <Grid item container spacing={2}>
                        <Grid item>
                            <Button color={"primary"} variant={"contained"} onClick={normalizeBios}>
                                Normalize Bios
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color={"primary"} variant={"contained"} onClick={normalizeStats}>
                                Normalize Stats
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color={"primary"} variant={"contained"} onClick={normalizeMoniesAndProvisions}>
                                Normalize Monies And Provisions
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color={"primary"} variant={"contained"} onClick={normalizePortraits}>
                                Normalize Portraits
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            </Paper>

        </div>);
}


const useStyles = makeStyles(() => (
    {
        root: {}
        ,
    }
));

export default Admin;

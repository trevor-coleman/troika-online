import Grid from '@material-ui/core/Grid';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { rollKey } from '../components/rolls/rollKey';
import { Item } from '../store/Item';
import { Skill } from '../store/Schema';

interface AdminProps {}

//COMPONENT
const Admin: FunctionComponent<AdminProps> = (props: AdminProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();

  async function testDice() {
    console.log("BEGINNING TEST");
    const result: { [key: number]: number } = {};
    for (let i = 0; i < 100; i++) {
      if(i % 100 == 0) console.log(i);
      const ref = await firebase.ref(`/diceTest`)
                                .push();
      const roll = rollKey(ref?.key ?? "someKey", [6, 6]);
      // const roll = [Math.floor(Math.random()* 6)+1,
      //               Math.floor(Math.random() * 6) + 1]
      const total = roll.reduce((
          (previousValue, currentValue) => previousValue + currentValue));
      if (!result[total]) {
        result[total] = 1;
      }
      else {
        result[total]++;
      }
    }

    console.log(result)
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

  async function moveSRD() {
    const srdItemsSnap = await firebase.ref('/srdItems')
                                       .once('value');
    const srdSkillsSnap = await firebase.ref('/srdSkills')
                                        .once('value');
    const items = srdItemsSnap.val();
    const skills = srdItemsSnap.val();

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
          <Grid
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
        </Box>
        </Paper>

      </div>);
}



const useStyles = makeStyles((theme: Theme) => (
  {
    root:{}
  ,
  }
));

export default Admin;

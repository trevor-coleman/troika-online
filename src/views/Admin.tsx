import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { Item } from '../store/Item';
import { Skill } from '../store/Schema';

interface AdminProps {}

//COMPONENT
const Admin: FunctionComponent<AdminProps> = (props: AdminProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();

  async function srdSkillSortNames (){
    const srdSkillsSnap = await firebase.ref('/srdSkills').orderByKey()
                                        .once('value');

    const srdSkills = srdSkillsSnap.val();

    const result: {[key:string]: any} = {}
    Object.keys(srdSkills).forEach(
        key=> {
          result[key] = {
            ...srdSkills[key],
            sort_name: srdSkills[key].name.toLowerCase()
          }
        }
    )

    await firebase.ref('/srdSkills').set(result)


    // const processedSkills = srdSkillsSnap.val().map((item:Skill)=>{
    //   return {
    //     ...item,
    //     sort_name: item.name.toLowerCase()
    //   }
    // })

  }

  async function moveSRD() {
    const srdItemsSnap = await firebase.ref('/srdItems').once('value');
    const srdSkillsSnap = await firebase.ref('/srdSkills').once('value');
    const items = srdItemsSnap.val();
    const skills = srdItemsSnap.val();

    const itemsUpdate = Object.keys(items)
                              .reduce<{ [key: string]: Item }>((
                                                                   (previousValue,
                                                                    currentValue) => {
                                                                     return {...previousValue,
                                                                       [currentValue]: {
                                                                         ...items[currentValue],
                                                                         sort_name: items[currentValue].name.toLowerCase(),
                                                                       },
                                                                     };
                                                                   }), {});

    const skillsUpdate = Object.keys(skills)
                               .reduce<{ [key: string]: Item }>((
                                                                    (previousValue,
                                                                     currentValue) => {
                                                                      return {
                                                                        ...previousValue,
                                                                        [currentValue]: {
                                                                          ...skills[currentValue],
                                                                          sort_name: skills[currentValue].name.toLowerCase(),
                                                                        },
                                                                      };
                                                                    }), {});

    console.log(skillsUpdate, itemsUpdate);

    await firebase.ref(`srdSkills`).update(skillsUpdate);
    await firebase.ref('srdItems').update(itemsUpdate);

  }

  firebase.ref('srdSkills')
          .orderByChild('sort_name')
          .startAt('cl')
          .once("value")
          .then(snap => console.log(snap.val()));

  return (
      <div className={classes.root}>
        <Typography variant={"h1"}>Admin</Typography>
        <Paper><Box p={2}>
          <Button disabled variant={"contained"}
                  onClick={moveSRD}> MoveSRD</Button>
          <Button
              variant={"contained"}

              onClick={srdSkillSortNames}>srdSkillSortNames</Button>
        </Box></Paper>

      </div>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Admin;

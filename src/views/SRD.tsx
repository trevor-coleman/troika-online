import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase } from 'react-redux-firebase';

import { useParams } from 'react-router-dom';
import NewSkillDialog from '../components/skills/NewSkillDialog';
import { Skill } from '../store/Schema';


interface SRDProps {
}

//COMPONENT
const SRD: FunctionComponent<SRDProps> = (props: SRDProps) => {
  const {} = props;
  const {type} = useParams<{ type: string }>()
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();

  console.log(type);

  async function handleCreateSkill (skill: Partial<Skill>) {
    await firebase.ref(`/srdSkills`).push(skill)

  }

  return (
      <div className={classes.root}>
        SRD
        {type == "skill" ? <NewSkillDialog open={true} onClose={()=>{}} onCreate={handleCreateSkill} clearOnCreate />:""}
        {/*{type == "item" ? <NewItemDialog open={true} onClose={()=>{}} character={null} srd/>:""}*/}
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default SRD;

import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles} from '@material-ui/core/styles';
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
  useDispatch();
    const firebase = useFirebase();



  async function handleCreateSkill (skill: Partial<Skill>) {
    await firebase.ref(`/srdSkills`).push(skill)

  }

  return (
      <div className={classes.root}>
        SRD
        {type == "skill" ? <NewSkillDialog open={true} onClose={()=>{}} onCreate={handleCreateSkill} clearOnCreate defaultSpell />:""}
        {/*{type == "item" ? <NewItemDialog open={true} onClose={()=>{}} character={null} srd/>:""}*/}
      </div>);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default SRD;

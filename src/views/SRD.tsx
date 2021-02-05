import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NewSkillDialog from '../components/skills/NewSkillDialog';
import { useParams } from 'react-router-dom';
import NewItemDialog from '../components/items/NewItemDialog';

interface SRDProps {
}

//COMPONENT
const SRD: FunctionComponent<SRDProps> = (props: SRDProps) => {
  const {} = props;
  const {type} = useParams<{ type: string }>()
  const classes = useStyles();
  const dispatch = useDispatch();

  console.log(type);

  return (
      <div className={classes.root}>
        SRD
        {type == "skill" ? <NewSkillDialog open={true} onClose={()=>{}} character={null} srd/>:""}
        {type == "item" ? <NewItemDialog open={true} onClose={()=>{}} character={null} srd/>:""}
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default SRD;

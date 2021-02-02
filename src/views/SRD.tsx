import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NewSkillDialog from '../components/Skills/NewSkillDialog';

interface SRDProps {
}

//COMPONENT
const SRD: FunctionComponent<SRDProps> = (props: SRDProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <div className={classes.root}>
        SRD
      <NewSkillDialog open={true} onClose={()=>{}} character={null} srd/>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default SRD;

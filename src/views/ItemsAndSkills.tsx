import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ItemsSection from '../components/Items/ItemsSection';
import SkillsSection from '../components/Skills/SkillsSection';

interface ItemsAndSkillsProps {
}

//COMPONENT
const ItemsAndSkills: FunctionComponent<ItemsAndSkillsProps> = (props: ItemsAndSkillsProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item>
            <ItemsSection parent={"library"} />
          </Grid>
          <Grid item>
            <SkillsSection parent={"library"} />
          </Grid>
        </Grid>
        </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default ItemsAndSkills;

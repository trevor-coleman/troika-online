import React, { FunctionComponent, useContext } from 'react';
import { CharacterContext } from '../../contexts/CharacterContext';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface SkillTextProps {
  name: string,
  skill: string,
}

const SkillSelectItem: FunctionComponent<SkillTextProps> = ({
                                                        name,
                                                        skill: id,
                                                      }: SkillTextProps) => {
  const {character} = useContext(CharacterContext);
  const classes = useItemStyles();
  useFirebaseConnect([
                       {
                         path   : `/skillValues/${character}/${id}`,
                         storeAs: `/skillText/${id}`,
                       },
                     ]);

  useTypedSelector(state => state.firebase.data?.skillText?.[id]);
    const {
    rank = 0,
    skill = 0,
  } = useTypedSelector(state => state.firebase.data?.skillText?.[id]) ?? {};
  return <div className={classes.skillItemWrapper}>
    <div className={classes.skillName}>{name}</div>
    <div className={classes.skillValue}>{rank + skill}</div>
  </div>;
};

const useItemStyles = makeStyles((theme: Theme) => (
    {
      skillName       : {
        display : "inline-block",
        flexGrow: 1,
      },
      skillValue      : {
        display        : "inline-block",
        paddingRight   : theme.spacing(0.5),
        paddingLeft    : theme.spacing(0.5),
        color          : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        textAlign      : "center",
      },
      skillItemWrapper: {
        display: 'flex',
        width  : "100%",
      },

    }));

export default SkillSelectItem

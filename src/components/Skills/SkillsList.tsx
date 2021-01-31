import React from 'react';
import {
  useFirebase, useFirebaseConnect,
} from 'react-redux-firebase';
import { Skill } from '../../types/troika';
import { useTypedSelector } from '../../store';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import SkillItem from './SkillItem';
import SkillForm from './SkillForm';

interface SkillsListProps {
  parent: string
}

function SkillsList({parent}: SkillsListProps) {
  const firebase = useFirebase();
  useFirebaseConnect([
    {
      path: `skills/${parent}`,
    },
  ]);
  const skills = useTypedSelector(state => {
    return state.firebase.data.skills
           ? state.firebase.data.skills[parent]
           : {};
  });

  const skill: Skill = {
    description: 'This is a skill to test firebase.' + Date.now(),
    name: 'Test Skill',
  };



  return (
      <div>
        <List>
        {skills? Object.keys(skills).map(k=><SkillItem parent={parent} skillId={k} key={k}/>) : ""}
        </List>
      </div>);
}

export default SkillsList;

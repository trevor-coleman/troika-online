import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  useFirebase, useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useTypedSelector } from '../../store';

interface ICharacterTitleProps {
  id: string;
}

type CharacterTitleProps = PropsWithChildren<ICharacterTitleProps>

export interface CharacterTitleState {
  name?: string,
  game?: string,
}

//COMPONENT
const CharacterTitle: FunctionComponent<CharacterTitleProps> = (props: CharacterTitleProps) => {
  const {
    id,
  } = props;
  useFirebaseConnect([
                       {
                         path   : `/characters/${id}/name`,
                         storeAs: `/characterTitle/name`,
                       }, {
      path   : `/characters/${id}/game`,
      storeAs: `/characterTitle/game`,
    },
                     ]);
  const state: CharacterTitleState = useTypedSelector(state => state.firebase.data?.characterTitle);

  if (!isLoaded(state)) return <div>Loading</div>;

  return (
      <div>
        <div>
          <Link to={`/game/${state.game}`}>
            <Typography paragraph>{"<"} Back </Typography></Link>
        </div>

        <div>
          <Typography variant={'h3'}>{state.name}</Typography>
        </div>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default CharacterTitle;

import React, { FunctionComponent, PropsWithChildren } from 'react';
import {
  useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {useCharacterGameKey, useCharacterName} from "../../store/selectors";

interface ICharacterTitleProps {
  id: string;
}

type CharacterTitleProps = PropsWithChildren<ICharacterTitleProps>


//COMPONENT
const CharacterTitle: FunctionComponent<CharacterTitleProps> = (props: CharacterTitleProps) => {
  const {
    id,
  } = props;
  useFirebaseConnect([

                         `/bios/${id}/name`,
                        {
      path   : `/characters/${id}/game`,
      storeAs: `/characterTitle/game`,
    },
                     ]);

  const name = useCharacterName(id);
  const game = useCharacterGameKey(id);

  return (
      <div>
        <div>
          <Link to={`/game/${game}`}>
            <Typography paragraph>{"<"} Back </Typography></Link>
        </div>

        <div>
          <Typography variant={'h3'}>{isLoaded(name) ? name : "Loading..."}</Typography>
        </div>
      </div>);
};


export default CharacterTitle;

import React, { FunctionComponent, useState } from 'react';
import { makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import { Zoom } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

interface IExpandCollapseButtonProps {
  expand: boolean,
  onClick: () => void
}

const ExpandCollapseButton: FunctionComponent<IExpandCollapseButtonProps> = (props: IExpandCollapseButtonProps) => {
  const {
    expand,
    onClick,
    ...rest
  } = props;
  useStyles();

    const [less, setLess] = useState(false);

  return (
      less ?
        <Zoom
            in={expand}
            onEnter={() => setLess(true)}
            onExited={() => setLess(false)}>
          {less
           ? <IconButton {...rest} onClick={onClick}>
             <ExpandLess />
           </IconButton>
           : <div />}
        </Zoom>

       : <Zoom
            in={!expand}
            onEnter={() => setLess(false)}
            onExited={() => setLess(true)}>
          {!less
           ? <IconButton {...rest} onClick={onClick}>
             <ExpandMore />
           </IconButton>
           : <div />}
        </Zoom>);
};

const useStyles = makeStyles(() => (
    {
      ExpandCollapseButton: {},
    }));

export default ExpandCollapseButton;

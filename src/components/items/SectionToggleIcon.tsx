import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface SectionToggleIconProps {
  section: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  show: boolean;
  expanded: boolean;
  onToggle: (section: string) => void,
}

const SectionToggleIcon = ({
                             section,
                             activeIcon,
                             inactiveIcon,
                             expanded,
                             onToggle,
                             show,
                           }: SectionToggleIconProps) => {


  return show
         ? <IconButton onClick={() => onToggle(section)}>
           {expanded
            ? activeIcon
            : inactiveIcon}
         </IconButton>
         : <></>;

};

const useStyles = makeStyles((theme: Theme) => (
    {
    }));

export default SectionToggleIcon;

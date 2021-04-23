import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface SectionToggleIconProps {
  section: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  enabled?: boolean,
  show: boolean;
  expanded: boolean;
  onToggle: (section: string) => void,
}

const SectionToggleIcon = ({
                             section,
                             activeIcon,
                             inactiveIcon,
                             expanded,
                              enabled,
                             onToggle,
                             show,
                           }: SectionToggleIconProps) => {


  return show
         ? <IconButton color={(expanded && section !== 'sectionToggles') ? 'secondary' : enabled ?'primary':undefined} onClick={() => onToggle(section)}>
           {enabled
            ? activeIcon
            : inactiveIcon}
         </IconButton>
         : <></>;

};

const useStyles = makeStyles((theme: Theme) => (
    {
    }));

export default SectionToggleIcon;

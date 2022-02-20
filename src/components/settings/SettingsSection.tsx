import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";

interface ISettingsSectionProps {title:string}

type SettingsSectionProps = PropsWithChildren<ISettingsSectionProps>;

const SettingsSection: FunctionComponent<SettingsSectionProps> = (props: SettingsSectionProps) => {
  const {title, children} = props;
  const classes = useStyles();

  return (
      <div className={classes.root}>
        {title
         ? <div className={classes.sectionTitle}>
           <Typography variant={"subtitle1"}>
             {title}
           </Typography>
         </div>
         : ""}
        <div className={classes.root}><Paper>
          <Box p={2}>
            {children}
          </Box>
        </Paper></div>
      </div>
      );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root        : {
        width: "100%",
      },
      container   : {
        borderRadius   : theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        paddingTop     : theme.spacing(2),
        paddingBottom  : theme.spacing(2),
        minHeight      : 150,

      },
      sectionTitle: {
        marginTop: theme.spacing(1),
        color    : theme.palette.text.secondary
      },
    }));

export default SettingsSection;

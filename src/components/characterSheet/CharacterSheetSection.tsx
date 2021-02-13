import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface ICharacterSheetSectionProps {
  title: string
}

type CharacterSheetSectionProps = PropsWithChildren<ICharacterSheetSectionProps>;

const CharacterSheetSection: FunctionComponent<CharacterSheetSectionProps> = (props: CharacterSheetSectionProps) => {
  const {title, children} = props;
  const classes = useStyles();

  return (
      <div className={classes.root}>
        {title
         ? <div className={classes.sectionTitle}>
          <Typography variant={"subtitle1"}>
            {title}
          </Typography>
        </div> : ""}
        <Grid container className={classes.container}>{children}</Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        width: "100%",
      },
      container: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),

      },
      sectionTitle: {
        marginTop: theme.spacing(1),
        color:theme.palette.text.secondary
      },
    }));

export default CharacterSheetSection;

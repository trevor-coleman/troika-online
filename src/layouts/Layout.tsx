import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { Container, Paper } from '@material-ui/core';
import { useAuth } from '../store/selectors';

interface ILayoutProps {
}

type LayoutProps = PropsWithChildren<ILayoutProps>
//COMPONENT
const Layout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const {} = props;
  const classes = useStyles();
  useDispatch();
    const firebase = useFirebase();
  const auth=useAuth();

  return (
      <Container className={classes.root}>
        <nav>
          <Link to={"/home"}>
            <Button>Home</Button>
          </Link>
          {auth.uid ? <Link to={"/settings"}>
            <Button>Settings</Button>
          </Link> : ""}
          <Button onClick={firebase.logout}>Sign Out</Button>
        </nav>
        <div>{props.children ?? ""}</div>
        <Paper
            className={classes.legalNoticeContainer}
            variant={'outlined'}>
          <Box p={1}>
            <Typography
                className={classes.legalNoticeText}
                variant={'caption'}>Troika-Online is an independent production
                                    by <a href={"https://www.github.com/trevor-coleman"} target={"_blank"}>Trevor Coleman</a> and is not affiliated with the
                                    Melsonian Arts Council. If you like Troika, <a
                  target={"_blank"}
                  href={"https://www.troikarpg.com/"}>support the creators!</a></Typography>
          </Box>
        </Paper>
      </Container>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root                : {paddingBottom: 150,
        display:"flex",
        flexDirection:"column",
        flexWrap: "wrap",
      },
      legalNoticeContainer: {
        marginTop      : theme.spacing(1),
        backgroundColor: theme.palette.grey.A100,
      },
      legalNoticeText     : {color: theme.palette.grey['600']},

    }));

export default Layout;

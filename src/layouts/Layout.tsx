import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { Container } from '@material-ui/core';

interface ILayoutProps {
}

type LayoutProps = PropsWithChildren<ILayoutProps>
//COMPONENT
const Layout: FunctionComponent<LayoutProps> = (props:LayoutProps  ) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();

  return (
      <Container className={classes.root}>
        <nav><Link to={"/home"}><Button>Home</Button></Link>
          <Link to={"/roll"}><Button>Roll</Button></Link>
          <Button onClick={firebase.logout}>Sign Out</Button></nav>
        <div>{props.children ?? ""}</div>
      </Container>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {paddingBottom: 150},

    }));

export default Layout;

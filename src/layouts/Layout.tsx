import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';

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
      <div className={classes.root}>
        <nav><Link to={"/home"}><Button>Home</Button></Link>
          <Button onClick={firebase.logout}>Sign Out</Button></nav>
        {props.children}
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Layout;

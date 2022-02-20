import React, { FunctionComponent, useState, PropsWithChildren } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Collapse } from '@material-ui/core';

interface ICollapsingSectionProps {expand?:boolean}

type CollapsingSectionProps = PropsWithChildren<ICollapsingSectionProps>;

const CollapsingSection: FunctionComponent<CollapsingSectionProps> = (props: CollapsingSectionProps) => {
  const {expand, children} = props;
  const [show, setShow] = useState(false)

  return (
      <Collapse in={expand} onEnter={()=>setShow(true)} onExited={()=>setShow(false)}>
        {show? children:''}
      </Collapse>);
};

makeStyles((theme: Theme) => (
    {
      CollapsingSection: {},
    }));

export default CollapsingSection;

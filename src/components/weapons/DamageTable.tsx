import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { TableRow, TableCell, Table, TableBody } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

interface IDamageTableProps {damage:number[]}

const DamageTable: FunctionComponent<IDamageTableProps> = (props: IDamageTableProps) => {
  const {damage} = props;
  const classes = useStyles();

  return (
      <Table
      ><TableBody>
        <TableRow>{damage.map((item, index) => (
            <TableCell
                className={classes.damageCell}
                key={`damage-header-${item}-${index}`}>
              <div className={classes.damageRollLabel}>
                {index + 1}
                {index == 6
                 ? "+"
                 : ""}
              </div>
              <Typography className={classes.damageItem}>
                {item}
              </Typography>
            </TableCell>))}
        </TableRow></TableBody>
      </Table>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      damageRollLabel: {
        fontSize: theme.typography.fontSize - 3,
        color   : theme.palette.text.hint,
        padding : 0,
      },
      damageTable    : {
        border: 0,
      },
      damageRow      : {
        border: 0
      },
      damageCell     : {
        padding      : 0,
        width        : "1rem",
        textAlign    : "center",
        verticalAlign: "baseline",
        borderBottom : 0,
      },
      damageItem     : {
        border      : "1px solid",
        borderColor : theme.palette.divider,
        textAlign   : "center",
        display     : "inline-block",
        minWidth    : "1rem",
        paddingLeft : theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        marginLeft  : 0,
        marginRight : 0,
        color       : theme.palette.text.primary,
      },
    }));

export default DamageTable;

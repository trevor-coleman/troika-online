import React, { FunctionComponent, useContext, useMemo } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CardHeader, CardContent, CardActions, Card } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Close, ChatBubbleTwoTone } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { CharacterContext } from '../../contexts/CharacterContext';
import { PopperContext } from '../skills/skillSections/SkillInfoButton';
import { ItemContext } from '../../contexts/ItemContext';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import DamageTable from './DamageTable';

interface IWeaponInfoPopperContentProps {}

type WeaponInfoPopperContentProps = IWeaponInfoPopperContentProps;

const WeaponInfoPopperContent: FunctionComponent<IWeaponInfoPopperContentProps> = (props: IWeaponInfoPopperContentProps) => {
  const {} = props;
  const classes = useStyles();
  const closePopper = useContext(PopperContext);
  const {character} = useContext(CharacterContext);
  const item = useContext(ItemContext);
  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${item}/name`,
                         storeAs: `itemInfoButton/${character}/${item}/name`,
                       }, {
      path   : `/items/${character}/${item}/description`,
      storeAs: `itemInfoButton/${character}/${item}/description`,
    }, {
      path   : `/items/${character}/${item}/damage`,
      storeAs: `itemInfoButton/${character}/${item}/damage`,
    }, {
      path   : `/items/${character}/${item}/twoHanded`,
      storeAs: `itemInfoButton/${character}/${item}/twoHanded`,
    }, {
      path   : `/items/${character}/${item}/ranged`,
      storeAs: `itemInfoButton/${character}/${item}/ranged`,
    }, {
      path   : `/items/${character}/${item}/armourPiercing`,
      storeAs: `itemInfoButton/${character}/${item}/armourPiercing`,
    },
                     ]);

  const {
    name = "",
    description = "",
    damage = [0, 0, 0, 0, 0, 0, 0],
    twoHanded,
    ranged,
    armourPiercing,
  } = useTypedSelector(state => state.firebase.data?.itemInfoButton?.[character]?.[item]) ??
      "";

  console.log(character, item, damage, twoHanded, ranged, armourPiercing);
  const attributes = useMemo( ()=> {
                                const result = [];
                                if (ranged) { result.push("Ranged")}
                                if (twoHanded) { result.push("Two Handed")}
                                if (armourPiercing) { result.push("Armour Piercing")}
    return result
                              },[ranged, twoHanded, armourPiercing]
  )

  console.log(attributes);




  return (
      <Card>
        <CardHeader
            title={name}
            titleTypographyProps={{variant: "subtitle2"}}
            action={<IconButton
                size={"small"}
                onClick={closePopper}><Close /></IconButton>} />
        <CardContent className={classes.cardContent}>
          <Typography paragraph={!Boolean(attributes.length)}
              variant={"body2"}>{description}</Typography>
          {attributes?.length ? <ul className={classes.attributeList}>
            {attributes.map(attribute=><li key={`${item}-${attribute}`}><Typography variant={"body2"}>{attribute}</Typography></li>)}
          </ul>:""}
          <DamageTable damage={damage} />
        </CardContent>
        <CardActions>
          <Button startIcon={<ChatBubbleTwoTone />}>Chat</Button>
          <Button startIcon={<Close />} onClick={closePopper}>Close</Button>
        </CardActions>
      </Card>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      WeaponInfoPopperContent: {},
      attributeList: {
        marginTop: 0,
        paddingTop:0,
      },

      paper                  : {
        border     : "1px solid",
        borderColor: theme.palette.primary.light,
        width      : theme.spacing(30),
      },
      popper                 : {
        zIndex: 1,
      },
      cardContent            : {paddingTop: 0},
    }));

export default WeaponInfoPopperContent;

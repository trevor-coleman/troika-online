import React, {
  FunctionComponent,
  PropsWithChildren,
  useState,
  useContext,
  ChangeEvent,

} from 'react';
import {
  useFirebase, useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { useAuth } from '../../store/selectors';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Switch,
  FormControlLabel,
  SvgIcon,
  Avatar,
  Fade,
  Typography,
  Collapse,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  SecurityTwoTone,
  SecurityOutlined,
  Delete,
  DeleteOutline,
  Edit,
  EditOutlined,
} from '@material-ui/icons';
import WorkIcon from '@material-ui/icons/Work';
import { Item } from '../../store/Item';
import { GameContext } from '../../contexts/GameContext';
import ChargesStepper from './ChargesStepper';
import { ReactComponent as SwordIconOutline } from './svg/sword-outline-svgrepo-com.svg';
import { ReactComponent as SwordIconFilled } from './svg/sword-filled-svgrepo-com.svg';
import { ReactComponent as LightningOutline } from './lightning-outline-svgrepo-com.svg';
import { ReactComponent as LightningFilled } from './lightning-filled-svgrepo-com.svg';
import { ReactComponent as WeightOutline } from './svg/weight-outline-svgrepo-com.svg';
import { ReactComponent as WeightFilled } from './svg/weight-filled-svgrepo-com.svg';
import { FormValueChangeHandler } from './forms/FormValueChange';
import { calculateSize } from './calculateSize';
import Button from '@material-ui/core/Button';
import ArmourSection from './forms/ArmourSection';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DamageSection from './forms/DamageSection';
import ChargesSection from './forms/ChargesSection';
import CustomSizeSection from './forms/CustomSizeSection';
import SectionToggleIcon from './SectionToggleIcon';
import { useTypedSelector } from '../../store';
import {
  DraggableProvidedDragHandleProps, Draggable,
} from 'react-beautiful-dnd';
import { CharacterContext } from '../../contexts/CharacterContext';
import { ItemContext } from '../../contexts/ItemContext';
import BasicInfoSection from './forms/BasicInfoSection';
import CollapsingSection from './forms/CollapsingSection';

interface IInventoryItemProps {
  id: string;
  index: number;
  onRemove: (id: string) => void,
  dragHandleProps?: DraggableProvidedDragHandleProps
}

type InventoryItemProps = PropsWithChildren<IInventoryItemProps>

interface ExpandState {
  isExpanded: boolean;
  damage: boolean;
  settings: boolean;
  charges: boolean;
  customSize: boolean;
  basic: boolean;
  armour: boolean;
  sectionToggles: boolean;

  [key: string]: boolean;
}

//COMPONENT
const InventoryItem: FunctionComponent<InventoryItemProps> = (props: InventoryItemProps) => {
  const {
    id,
    onRemove,
    index,
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  useAuth();
    const {character, editable} = useContext(CharacterContext);
  const rollContext = useContext(GameContext);
  useContext(GameContext);
    useFirebaseConnect([
    {
      path   : `/items/${character}/${id}`,
      storeAs: `/inventoryItem/${id}`,
    }, {
      path   : `/characters/${character}/inventory`,
      storeAs: `/inventoryItem/${id}/inventory`,
    }, {
      path: `/characters/${character}/inventoryPositions`,
    },
  ]);
  const item: Item = useTypedSelector(state => state.firebase.data?.inventoryItem?.[id]);

  const {
    name = "",
    description = "",
    isEquipped = false,
    hasCharges = false,
    doesDamage = false,
    size = 0,
    protects = false,
    customSize = false,
  }: Item = item ?? {};

  let initialState: ExpandState = {
    isExpanded    : false,
    basic         : false,
    damage        : false,
    armour        : false,
    charges       : false,
    customSize    : false,
    settings      : false,
    sectionToggles: true,
  };
  const [expanded, setExpanded] = useState<ExpandState>(initialState);
  const inventoryPositions = useTypedSelector(state => state.firebase.data?.characters?.[character]?.inventoryPositions);

  const position = inventoryPositions
                   ? inventoryPositions[id] ?? 0
                   : 0;

  const toggle = (section?: string) => {
    if (!section) {
      setExpanded(initialState);
      return;
    }
    const shouldExpand = !expanded[section];
    setExpanded(shouldExpand
                ? {
          ...initialState,
          isExpanded: shouldExpand,
          [section] : !expanded[section],
        }
                : initialState);
  };

  const handleChange: FormValueChangeHandler = (updates) => {

    const update = updates.reduce<Partial<Item>>((prev, curr) => {
      const sizeOverride = calculateSize(item, curr);

      return {
        ...prev,
        [curr.id]: curr.value, ...sizeOverride,
      };
    }, {});

    firebase.ref(`/items/${character}/${id}`)
            .update(update);
  };

  const handleEquip = ({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
    firebase.ref(`/items/${character}/${id}/isEquipped`)
            .set(checked);
  };

  if (!isLoaded(item)) return <Card><CardContent>Loading</CardContent></Card>;

  const isEncumbered = () => (position + size) > 12;

  const rollInventory = () => {
    rollContext.roll({
      type      : 'inventory',
      position  : position + 1,
      itemName  : name,
      rollerKey : character,
      dice      : [6, 6],
    });
  };

  return (
      <ItemContext.Provider value={id}>
        <Draggable
            isDragDisabled={!editable}
            draggableId={id}
            index={index}>{(provided) => (
            <Grid
                item
                xs={12}
                innerRef={provided.innerRef}
                {...provided.draggableProps}
            >
              <Card className={classes.card}>
                <CardHeader
                    avatar={<Avatar
                        className={isEncumbered()
                                   ? classes.problemAvatar
                                   : undefined}>{position + 1}</Avatar>}
                    className={classes.cardHeader}
                    titleTypographyProps={{variant: "h6"}}
                    title={`${name}`}
                    subheader={description}
                    subheaderTypographyProps={{
                      variant: "caption",
                      color  : 'textPrimary',
                    }}
                    action={<div className={classes.headerAction}>{hasCharges
                                                                   ?
                                                                   <ChargesStepper item={id} />
                                                                   :
                                                                   <div />}<FormControlLabel
                        value="bottom"
                        control={<Switch
                            disabled={!editable}
                            checked={isEquipped}
                            onChange={(e) => handleEquip(e)}
                            color="primary" />}
                        label="Equip"
                        labelPlacement="bottom" /></div>}
                    {...provided.dragHandleProps} />
                <Collapse in={isEncumbered()}><CardContent><Typography
                    variant={'overline'}
                    color={'error'}>This item is too large to fit in
                                    inventory!</Typography>
                  <Typography
                      variant={'body2'}
                      color={'error'}>(Size: {size}, Available Space: {12 - (
                      position)})</Typography></CardContent></Collapse>
                <CardActions className={classes.cardActions}>
                  <div className={classes.sectionToggles}>
                    <SectionToggleIcon
                        section={"basic"}
                        expanded={expanded.basic}
                        onToggle={toggle}
                        show={true}
                        activeIcon={<Edit />}
                        inactiveIcon={<EditOutlined />} />
                    <SectionToggleIcon
                        section={"armour"}
                        expanded={expanded.armour}
                        enabled={protects}
                        onToggle={toggle}
                        show={protects || expanded.sectionToggles}
                        activeIcon={<SecurityTwoTone />}
                        inactiveIcon={<SecurityOutlined />} />
                    <SectionToggleIcon
                        section={"damage"}
                        onToggle={toggle}
                        enabled={doesDamage}
                        show={doesDamage || expanded.sectionToggles}
                        expanded={expanded.damage}
                        activeIcon={<SvgIcon
                            component={SwordIconFilled}
                            viewBox={"0 0 290.226 290.226"} />}
                        inactiveIcon={<SvgIcon
                            component={SwordIconOutline}
                            viewBox={"0 0 57 57"} />} />
                    <SectionToggleIcon
                        section={"customSize"}
                        onToggle={toggle}
                        enabled={customSize}
                        show={customSize || expanded.sectionToggles}
                        expanded={expanded.customSize}
                        activeIcon={<SvgIcon
                            component={WeightFilled}
                            viewBox={"0 0 299.799 299.799"} />}
                        inactiveIcon={<SvgIcon
                            component={WeightOutline}
                            viewBox={"0 0 512 512"} />} />

                    <SectionToggleIcon
                        section={"charges"}
                        onToggle={toggle}
                        enabled={hasCharges}
                        show={hasCharges || expanded.sectionToggles}
                        expanded={expanded.charges}
                        activeIcon={<SvgIcon
                            component={LightningFilled}
                            viewBox={"0 0 46.093 46.093"} />}
                        inactiveIcon={<SvgIcon
                            component={LightningOutline}
                            viewBox={"0 0 192.008 192.008"} />} />
                    {editable ? <SectionToggleIcon

                        section={"settings"}
                        onToggle={toggle}
                        show={true}
                        expanded={expanded.settings}
                        activeIcon={<Delete />}
                        inactiveIcon={<DeleteOutline />} />:""}
                  </div>
                  <div className={classes.rolls}>
                    <Button
                        disabled={!editable}
                        variant={"contained"}
                        startIcon={<WorkIcon />}
                        onClick={rollInventory}
                    >Retrieve</Button>
                  </div>
                </CardActions>
                <CollapsingSection expand={expanded.isExpanded}>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.basic}>

                    <BasicInfoSection onChange={handleChange} />
                  </FadingSection>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.armour}>
                    <ArmourSection
                        character={character}
                        item={id}
                        onChange={handleChange} />
                  </FadingSection>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.damage}>
                    <DamageSection onChange={handleChange} />
                  </FadingSection>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.customSize}>
                    <CustomSizeSection onChange={handleChange} />
                  </FadingSection>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.charges}>
                    <ChargesSection onChange={handleChange} />
                  </FadingSection>
                  <FadingSection
                      onClose={toggle}
                      expanded={expanded.settings}>
                    <Button
                        disabled={!editable}
                        onClick={() => onRemove(id)}
                        variant={"contained"}
                        color={"secondary"}>Remove</Button>
                  </FadingSection>
                </CollapsingSection>
              </Card>
            </Grid>)}</Draggable></ItemContext.Provider>);
};

const FadingSection = (props: PropsWithChildren<{ expanded: boolean, onClose: () => void }>) => {
  const {
    expanded,
    children,
    onClose,
  } = props;

  const classes = useFadingStyles();
  const [showChildren, setShowChildren] = useState(expanded);

  return <Fade
      in={expanded}
      onEnter={() => setShowChildren(true)}
      onExited={() => setShowChildren(false)}>
    {showChildren
     ? <>
       <CardContent>
         {children}
       </CardContent>
       <CardActions>
         <div className={classes.spacer} />
         <Button
             variant="contained"
             color={"primary"}
             onClick={() => onClose()}>Close</Button>
       </CardActions></>
     : <div />}
  </Fade>;
};

const useFadingStyles = makeStyles(() => (
    {
      spacer: {
        flexGrow: 1,
      },
    }));

const useStyles = makeStyles((theme: Theme) => (
    {
      root           : {},
      card           : {
        border     : "1px solid",
        borderColor: theme.palette.divider,
        margin     : theme.spacing(1),
      },
      cardHeader     : {
        paddingTop   : theme.spacing(2),
        paddingBottom: 0,
      },
      headerAction   : {
        display      : "flex",
        flexDirection: 'row',
      },
      itemDescription: {
        paddingTop   : 0,
        paddingBottom: 0,
      },
      cardActions    : {display: 'flex'},
      sectionToggles : {flexGrow: 1},
      problemAvatar  : {
        backgroundColor: theme.palette.error.main,
      },
      rolls          : {
        display       : "flex",
        flexDirection : "row",
        justifyContent: "flex-end",
        flexGrow      : 1,
      },
    }));

export default InventoryItem;

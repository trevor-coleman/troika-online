import React, {
  FunctionComponent, PropsWithChildren, useState, useContext,
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
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  SecurityTwoTone,
  SecurityOutlined,
  Casino,
  ChevronRight,
  ChevronLeft,
  Delete,
  DeleteOutline,
  Edit,
  EditOutlined,
} from '@material-ui/icons';
import {KeyList} from '../../store/KeyList';
import {Item} from '../../store/Item';
import { ReactComponent as SwordIconOutline } from './sword-outline-svgrepo-com.svg';
import { ReactComponent as SwordIconFilled } from './sword-filled-svgrepo-com.svg';
import { ReactComponent as LightningOutline } from './lightning-outline-svgrepo-com.svg';
import { ReactComponent as LightningFilled } from './lightning-filled-svgrepo-com.svg';
import { ReactComponent as WeightOutline } from './weight-outline-svgrepo-com.svg';
import { ReactComponent as WeightFilled } from './weight-filled-svgrepo-com.svg';
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
import { CharacterContext } from '../../views/CharacterContext';
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

//COMPONENT
const InventoryItem: FunctionComponent<InventoryItemProps> = (props: InventoryItemProps) => {
  const {
    id,
    onRemove,
    dragHandleProps,
    index,
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${id}`,
                         storeAs: `/inventoryItem/${id}`,
                       },
                     ]);
  const item: Item = useTypedSelector(state => state.firebase.data?.inventoryItem?.[id]);
  const {
    name = "",
    description = "",
    size = 1,
    hasCharges = false,
    doesDamage = false,
    hasModifiers = false,
    protects = false,
    customSize = false,
  }: Item = item ?? {};

  const [expanded, setExpanded] = useState<KeyList>({
                                                      basic         : false,
                                                      damage        : false,
                                                      armour        : false,
                                                      charges       : false,
                                                      customSize    : false,
                                                      settings      : false,
                                                      sectionToggles: true,
                                                    });

  const toggle = (section: string) => {
    setExpanded({
                  ...expanded,
                  [section]: !expanded[section],
                });
  };

  const handleChange: FormValueChangeHandler = (updates) => {

    const update = updates.reduce<Partial<Item>>((prev, curr, index) => {
      const sizeOverride = calculateSize(item, curr);

      return {
        ...prev,
        [curr.id]: curr.value, ...sizeOverride,
      };
    }, {});

    firebase.ref(`/items/${character}/${id}`).update(update);
  };

  if (!isLoaded(item)) return <Card><CardContent>Loading</CardContent></Card>;

  return (
      <ItemContext.Provider value={id}><Draggable draggableId={id}
                                                  index={index}>{(provided,
                                                                  snapshot) => (
          <Grid item
                xs={12}
                innerRef={provided.innerRef}
                {...provided.draggableProps}
          >
            <Card className={classes.card}>
              <CardHeader avatar={<Avatar>{size}</Avatar>}
                          className={classes.cardHeader}
                          titleTypographyProps={{variant: "h6"}}
                          title={`${name}`}
                          subheader={description}
                          subheaderTypographyProps={{
                            variant: "caption",
                            color  : 'textPrimary',
                          }}
                          action={<FormControlLabel value="bottom"
                                                    control={
                                                      <Switch color="primary" />}
                                                    label="Equip"
                                                    labelPlacement="bottom" />}
                          {...provided.dragHandleProps} />

              <CardActions className={classes.cardActions}>
                <div className={classes.sectionToggles}>
                  <SectionToggleIcon expanded={expanded.sectionToggles}
                                     onToggle={toggle}
                                     section={"sectionToggles"}
                                     activeIcon={<ChevronLeft />}
                                     inactiveIcon={<ChevronRight />}
                                     show={true} />
                  <SectionToggleIcon section={"basic"}
                                     expanded={expanded.basic}
                                     onToggle={toggle}
                                     show={true}
                                     activeIcon={<Edit />}
                                     inactiveIcon={<EditOutlined />} />
                  <SectionToggleIcon section={"armour"}
                                     expanded={expanded.armour}
                                     onToggle={toggle}
                                     show={protects || expanded.sectionToggles}
                                     activeIcon={<SecurityTwoTone />}
                                     inactiveIcon={<SecurityOutlined />} />
                  <SectionToggleIcon section={"damage"}
                                     onToggle={toggle}
                                     show={doesDamage ||
                                           expanded.sectionToggles}
                                     expanded={expanded.damage}
                                     activeIcon={
                                       <SvgIcon component={SwordIconFilled}
                                                viewBox={"0 0 290.226 290.226"} />}
                                     inactiveIcon={
                                       <SvgIcon component={SwordIconOutline}
                                                viewBox={"0 0 57 57"} />} />
                  <SectionToggleIcon section={"customSize"}
                                     onToggle={toggle}
                                     show={customSize ||
                                           expanded.sectionToggles}
                                     expanded={expanded.customSize}
                                     activeIcon={
                                       <SvgIcon component={WeightFilled}
                                                viewBox={"0 0 299.799 299.799"} />}
                                     inactiveIcon={
                                       <SvgIcon component={WeightOutline}
                                                viewBox={"0 0 512 512"} />} />

                  <SectionToggleIcon section={"charges"}
                                     onToggle={toggle}
                                     show={hasCharges ||
                                           expanded.sectionToggles}
                                     expanded={expanded.charges}
                                     activeIcon={
                                       <SvgIcon component={LightningFilled}
                                                viewBox={"0 0 46.093 46.093"} />}
                                     inactiveIcon={
                                       <SvgIcon component={LightningOutline}
                                                viewBox={"0 0 192.008 192.008"} />} />
                  <SectionToggleIcon section={"settings"}
                                     onToggle={toggle}
                                     show={true}
                                     expanded={expanded.settings}
                                     activeIcon={<Delete />}
                                     inactiveIcon={<DeleteOutline />} />


                </div>
                <div className={classes.rolls}>
                  <Button disabled variant={"contained"}
                          startIcon={<Casino />}>Roll</Button>
                </div>
              </CardActions>
              <CollapsingSection expand={expanded.basic}>
                <CardContent>
                  <BasicInfoSection onChange={handleChange} />
                </CardContent>
              </CollapsingSection>
              <CollapsingSection expand={expanded.armour}>
                <CardContent>
                  <ArmourSection character={character}
                                 item={id}
                                 onChange={handleChange} />
                </CardContent>
              </CollapsingSection>
              <CollapsingSection expand={expanded.damage}>
                <CardContent>
                  <DamageSection onChange={handleChange} />
                </CardContent>
              </CollapsingSection>
              <CollapsingSection expand={expanded.customSize}>
                <CardContent>
                  <CustomSizeSection onChange={handleChange} />
                </CardContent>
              </CollapsingSection>
              <CollapsingSection expand={expanded.charges}>
                <CardContent>
                  <ChargesSection onChange={handleChange} />
                </CardContent>
              </CollapsingSection>
              <CollapsingSection expand={expanded.settings}>
                <CardContent>
                  <Button onClick={() => onRemove(id)}
                          variant={"contained"}
                          color={"secondary"}>Remove</Button>
                </CardContent>
              </CollapsingSection>
            </Card>
          </Grid>)}</Draggable></ItemContext.Provider>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root           : {},
      card: {
        border: "1px solid",
        borderColor: theme.palette.divider,
        margin: theme.spacing(1),
      },
      cardHeader     : {
        paddingTop   : theme.spacing(2),
        paddingBottom: 0,
      },
      itemDescription: {
        paddingTop   : 0,
        paddingBottom: 0,
      },
      cardActions    : {display: 'flex'},
      sectionToggles : {flexGrow: 1},
      rolls          : {
        display       : "flex",
        flexDirection : "row",
        justifyContent: "flex-end",
        flexGrow      : 1,
      },
    }));

export default InventoryItem;

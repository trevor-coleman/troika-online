import React, {
  FunctionComponent, PropsWithChildren, useState, useEffect, useCallback,
} from 'react';
import {
  useFirebase, useFirebaseConnect, isLoaded, isEmpty,
} from 'react-redux-firebase';
import { useAuth, useItem } from '../../store/selectors';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Switch,
  FormControlLabel,
  SvgIcon,
  Collapse, Avatar,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  DragHandle,
  SecurityTwoTone,
  SecurityOutlined,
  Casino,
  ChevronRight,
  ChevronLeft,
  Delete, DeleteOutline,
} from '@material-ui/icons';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SettingsApplicationsOutlinedIcon
  from '@material-ui/icons/SettingsApplicationsOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Item, KeyList } from '../../store/Schema';
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
  DraggableId,
  DraggableChildrenFn,
  DraggableProvidedDragHandleProps,
  DraggableProps, Draggable,
} from 'react-beautiful-dnd';

interface IInventoryItemProps {
  id: string;
  index: number;
  onRemove: (id: string) => void,
  characterKey: string;
  dragHandleProps?:DraggableProvidedDragHandleProps
}

type InventoryItemProps = PropsWithChildren<IInventoryItemProps>


//COMPONENT
const InventoryItem: FunctionComponent<InventoryItemProps> = React.memo((props: InventoryItemProps) => {
  const {
    id, onRemove, characterKey, dragHandleProps, index
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  useFirebaseConnect([`/characters/${characterKey}/items/${id}`]);
  const item: Item = useTypedSelector(state=>state.firebase.data?.characters?.[characterKey]?.items?.[id])
  const [values, setValues] = useState<Partial<Item>>({
                                                              armourPiercing: false,
                                                              characters    : undefined,
                                                              charges       : {
                                                                initial: 0,
                                                                max    : 0,
                                                              },
                                                              customSize    : false,
                                                              damage        : [],
                                                              damagesAs     : '',
                                                              description   : '',
                                                              doesDamage    : false,
                                                              hasCharges    : false,
                                                              hasModifiers  : false,
                                                              modifiers     : {},
                                                              name          : '',
                                                              protection    : 0,
                                                              protects      : false,
                                                              ranged        : false,
                                                              size          : 0,
                                                              twoHanded     : false,
                                                            });

  useEffect(() => {
    if (isLoaded(item) && !isEmpty(item)) setValues(item);
  }, [item]);
  const [expanded, setExpanded] = useState<KeyList>({
                                                      damage        : false,
                                                      armour        : false,
                                                      charges       : false,
                                                      customSize    : false,
    settings: false,
                                                      sectionToggles: false,
                                                    });

  const toggle = useCallback((section: string) => {
    setExpanded({
                  ...expanded,
                  [section]: !expanded[section],
                });
  }, [expanded]);

  const handleChange: FormValueChangeHandler = useCallback(async (updates) => {

    const update = updates.reduce<Partial<Item>>((prev, curr, index) => {
      const sizeOverride = calculateSize(item, curr);

      return {
        ...prev,
        [curr.id]: curr.value, ...sizeOverride,

      };
    }, {});

    const result = await firebase.ref(`/characters/${characterKey}/items/${id}`).update(update);

  }, [characterKey, id]);

  return (
      <Draggable draggableId={id} index={index}>{(provided, snapshot)=>(
      <Grid item xs={12}
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            >
          <Card>
            <CardHeader avatar={<Avatar>{values?.size}</Avatar>}
                    className={classes.cardHeader}
                    titleTypographyProps={{variant: "h6"}}
                    title={`${item?.name}${item?.hasCharges ? ` - ${item.charges?.initial} / ${item.charges?.max}` : ""}`}
                    subheader={values?.description}
                    subheaderTypographyProps={{
                      variant: "body1",
                      color  : 'textPrimary',
                    }}
                    action={<FormControlLabel value="bottom"
                                              control={
                                                <Switch color="primary" />}
                                              label="Equip"
                                              labelPlacement="bottom" />}
                        {...provided.dragHandleProps}
            />

        <CardActions className={classes.cardActions}>
          <div className={classes.sectionToggles}>
            <SectionToggleIcon expanded={expanded.sectionToggles}
                               onToggle={toggle}

                               section={"sectionToggles"}
                               activeIcon={<ChevronLeft />}
                               inactiveIcon={<ChevronRight />}
                               show={true} />
            <SectionToggleIcon section={"armour"}
                               expanded={expanded.armour}
                               onToggle={toggle}
                               show={values.protects || expanded.sectionToggles}
                               activeIcon={<SecurityTwoTone />}
                               inactiveIcon={<SecurityOutlined />} />
            <SectionToggleIcon section={"damage"}
                               onToggle={toggle}
                               show={values.doesDamage ||
                                     expanded.sectionToggles}
                               expanded={expanded.damage}
                               activeIcon={<SvgIcon component={SwordIconFilled}
                                                    viewBox={"0 0 290.226 290.226"} />}
                               inactiveIcon={
                                 <SvgIcon component={SwordIconOutline}
                                          viewBox={"0 0 57 57"} />} />
            <SectionToggleIcon section={"customSize"}
                               onToggle={toggle}
                               show={values.customSize ||
                                     expanded.sectionToggles}
                               expanded={expanded.customSize}
                               activeIcon={<SvgIcon component={WeightFilled}
                                                    viewBox={"0 0 299.799 299.799"} />}
                               inactiveIcon={<SvgIcon component={WeightOutline}
                                                      viewBox={"0 0 512 512"} />} />

            <SectionToggleIcon section={"charges"}
                               onToggle={toggle}
                               show={values.hasCharges ||
                                     expanded.sectionToggles}
                               expanded={expanded.charges}
                               activeIcon={<SvgIcon component={LightningFilled}
                                                    viewBox={"0 0 46.093 46.093"} />}
                               inactiveIcon={
                                 <SvgIcon component={LightningOutline}
                                          viewBox={"0 0 192.008 192.008"} />} />
            <SectionToggleIcon section={"settings"}
                               onToggle={toggle}
                               show={true}
                               expanded={expanded.settings}
                               activeIcon={<Delete/>}
                               inactiveIcon={<DeleteOutline/>} />


          </div>
          <div className={classes.rolls}>
            <Button variant={"contained"}
                    startIcon={<Casino />}>Attack</Button>
          </div>
        </CardActions>
        {isLoaded(item)
         ? <><Collapse in={expanded.armour}>
              <CardContent>
                <ArmourSection protects={values.protects ?? false}
                               protection={values.protection ?? 0}
                               onChange={handleChange} />
              </CardContent>
            </Collapse>
              <Collapse in={expanded.damage}>
                <CardContent>
                  <DamageSection damagesAs={values.damagesAs}
                                 damage={values.damage}
                                 ranged={values.ranged ?? false}
                                 twoHanded={values.twoHanded ?? false}
                                 armourPiercing={values.armourPiercing ?? false}
                                 onChange={handleChange}
                                 doesDamage={values.doesDamage} />
                </CardContent>
              </Collapse>
              <Collapse in={expanded.customSize}>
                <CardContent>
                  <CustomSizeSection onChange={handleChange}
                                     customSize={values.customSize ?? false}
                                     size={values.size ?? 1} />
                </CardContent>
              </Collapse>
              <Collapse in={expanded.charges}>
                <CardContent>
                  <ChargesSection onChange={handleChange}
                                  hasCharges={values.hasCharges}
                                  charges={values.charges} />
                </CardContent>
              </Collapse>
              <Collapse in={expanded.settings}>
                <CardContent>
                  <Button onClick={()=>onRemove(id)} variant={"contained"} color={"secondary"}>Remove</Button>
                </CardContent>
              </Collapse>
         </>
         : ""}
          </Card>
      </Grid>)}</Draggable>);
});


const useStyles = makeStyles((theme: Theme) => (
    {
      root           : {},
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

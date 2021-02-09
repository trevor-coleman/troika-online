import { FormValueChange } from './forms/FormValueChange';
import { Item } from '../../store/Item';

export function calculateSize(values: Item, update: FormValueChange<any>) {
  const sizeOverride: Partial<Item> = {};
  const {
    id,
    value,
    source,
  } = update;

  function twoHandedSize(isTwoHanded: boolean) {

    return isTwoHanded
           ? Math.max(2,
                      (
                          values.protects && values.protection)
                      ? values.protection * -2
                      : 0,
                      1)
           : Math.max((
                          values.protects && values.protection)
                      ? values.protection * -2
                      : 0, 1);
  }

  function protectionSize(protects: boolean, protection: number) {

    return protects
           ? Math.max(1,

                      values.doesDamage && values.twoHanded
                      ? 2
                      : 0,

                      protects && protection
                      ? protection * -2
                      : 0)

           : Math.max(1,
                      (
                          values.doesDamage && values.twoHanded)
                      ? 2
                      : 0);
  }

  //reject changes if custom size is enabled
  if (values.customSize && id === "size" && source !== "customSizeSection")
  {
    sizeOverride.size = value.size;
  }

  //recalculate size if disabling custom size
  else if (id === "customSize" && !value)
  {
    sizeOverride.size =
        Math.max(values.twoHanded
                 ? 2
                 : 0,
                 values.protects && values.protection
                 ? values.protection * -2
                 : 0,
                 1);
  }

  else if (id === "doesDamage")
  {
    if (value && values.twoHanded)
    {
      sizeOverride.size = twoHandedSize(values.twoHanded);
    }
    else
    {
      sizeOverride.size = twoHandedSize(false);
      console.log(sizeOverride);
    }
  }

  //adjust size if needed for two handed weapons
  else if (id === "twoHanded" && !values.customSize)
  {
    sizeOverride.size = twoHandedSize(value);
  }

  else if (id == "protects" && !values.customSize)
  {
    sizeOverride.size = protectionSize(value, values.protection ?? 0);
  }

  //adjust size if needed for armour
  else if (id === "protection" && !values.customSize)
  {
    sizeOverride.size = protectionSize(values.protects, value);
  }

  return sizeOverride;
}

import {FormValueChange} from './forms/FormValueChange';
import {Item} from '../../store/Item';

export function calculateSize(currentValues: Item, update: FormValueChange<any>) {
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
                    currentValues.protects && currentValues.protection)
                    ? currentValues.protection * -2
                    : 0,
                1)
            : Math.max((
                currentValues.protects && currentValues.protection)
                ? currentValues.protection * -2
                : 0, 1);
    }

    function protectionSize(protects: boolean, protection: number) {

        return protects
            ? Math.max(1,

                currentValues.doesDamage && currentValues.twoHanded
                    ? 2
                    : 0,

                protects && protection
                    ? protection * -2
                    : 0)

            : Math.max(1,
                (
                    currentValues.doesDamage && currentValues.twoHanded)
                    ? 2
                    : 0);
    }

    //reject changes if custom size is enabled
    if (currentValues.customSize && id === "size") {
        sizeOverride.size = source === "customSizeSection" ? value : currentValues.size;
    }

    //recalculate size if disabling custom size
    else if (id === "customSize" && !value) {
        sizeOverride.size =
            Math.max(currentValues.twoHanded
                    ? 2
                    : 0,
                currentValues.protects && currentValues.protection
                    ? currentValues.protection * -2
                    : 0,
                1);
    } else if (id === "doesDamage") {
        if (value && currentValues.twoHanded) {
            sizeOverride.size = twoHandedSize(currentValues.twoHanded);
        } else {
            sizeOverride.size = twoHandedSize(false);
            console.log(sizeOverride);
        }
    }

    //adjust size if needed for two-handed weapons
    else if (id === "twoHanded" && !currentValues.customSize) {
        sizeOverride.size = twoHandedSize(value);
    } else if (id == "protects" && !currentValues.customSize) {
        sizeOverride.size = protectionSize(value, currentValues.protection ?? 0);
    }

    //adjust size if needed for armour
    else if (id === "protection" && !currentValues.customSize) {
        sizeOverride.size = protectionSize(currentValues.protects, value);
    }
    debugger;
    return sizeOverride;
}

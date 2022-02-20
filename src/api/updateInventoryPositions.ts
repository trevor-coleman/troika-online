import firebase from 'firebase/app';

const db =  firebase.database();

let lastKey:string = "";

export default async function updateInventoryPositions (character: string, key:string) {
  lastKey = key;

  async function getSize(item: string):Promise<number> {
    const snap = await db.ref(`/items/${character}/${item}/size`).get();
    return 1*snap.val();
  }

  const snap = await db.ref(`/characters/${character}`).child('inventory').get();
  const inventory =  snap.val();

  const sizes:{[key:string]: number} = {}
  const positions: { [key: string]: number } = {}
  let position = 0;
  for (let i=0; i<inventory.length; i++) {
    const itemSize = await getSize(inventory[i])
    sizes[inventory[i]] = itemSize;
    positions[inventory[i]] = position;
    position = (position) + (itemSize);
  }



  if(lastKey === key) {
    await db.ref(`/characters/${character}/inventoryPositions`)
            .set(positions);
  }
}

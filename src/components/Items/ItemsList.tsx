import React from 'react';
import {
  useFirebase, useFirebaseConnect,
} from 'react-redux-firebase';
import { Item } from '../../types/troika';
import { useTypedSelector } from '../../store';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ItemItem from './ItemItem';
import ItemForm from './ItemForm';

interface ItemsListProps {
  parent: string
}

function ItemsList({parent}: ItemsListProps) {
  const firebase = useFirebase();
  useFirebaseConnect([
    {
      path: `items/${parent}`,
    },
  ]);
  const items = useTypedSelector(state => {
    return state.firebase.data.items
           ? state.firebase.data.items[parent]
           : {};
  });
  
  return (
      <div>
        <List>
        {items? Object.keys(items).map(k=><ItemItem parent={parent} itemId={k} key={k}/>) : ""}
        </List>
      </div>);
}

export default ItemsList;

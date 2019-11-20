import React from 'react';
import { Grid, Item, Header, List } from 'semantic-ui-react';

import * as cappuccino from '../Assets/cappuccino.jpeg';
import * as coffee from '../Assets/coffee.jpeg';
import * as latte from '../Assets/latte.jpeg';
import { getLastOrder, postMakeOrder } from '../Axios/axios_getter';

class MenuBar extends React.Component {

  handleItemClick = () => {

    getLastOrder()
    .then(lastOrder => {
      //const nextid = orderid + 1;
      const update = {
         items: ['Latte'],
         quantity: '1',
         orderid: '0'
       };
      postMakeOrder(update);
    })
    .catch(error => {
      const firstOrder = {
        items: ['Latte'],
        quantity: '1',
        orderid: 1
      };
      postMakeOrder(firstOrder);
    });

  }

  render() {

    const { item } = this.props;

    {/* Pull images from database */}
    return (

      <Item>
        <Item.Image src={coffee} onClick={() => this.props.handleItemClick(item)} style={{ cursor: 'pointer' }}/>

        <Item.Content verticalAlign='middle'>
          <Item.Header as='a' onClick={() => this.props.handleItemClick(item)}>{item.name}</Item.Header>
          <Item.Meta>{item.description}</Item.Meta>
        </Item.Content>
      </Item>
    );
  }
}

export default MenuBar;

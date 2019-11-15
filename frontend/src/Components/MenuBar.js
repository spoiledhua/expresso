import React from 'react';
import { Grid, Item, Header, List } from 'semantic-ui-react';

import * as cappuccino from '../Assets/cappuccino.jpeg';
import * as coffee from '../Assets/coffee.jpeg';
import * as latte from '../Assets/latte.jpeg';
import { getLastOrder, postMakeOrder } from '../Axios/axios_getter';

class MenuBar extends React.Component {

  handleItemClick = (e) => {

    getLastOrder()
    .then(lastOrder => {
      console.log(lastOrder.cost);
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

    {/* Pull images from database */}
    return (
      <Item>
        <Item.Image src={coffee} />

        <Item.Content verticalAlign='middle'>
          <Item.Header as='a' onClick={this.handleItemClick} >Hot Coffee</Item.Header>
          <Item.Meta>Not your everyday cup of Joe.</Item.Meta>
        </Item.Content>
      </Item>
    );
  }
}

export default MenuBar;

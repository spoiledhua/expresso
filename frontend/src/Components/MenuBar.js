import React from 'react';
import { Item, Header } from 'semantic-ui-react';

class MenuBar extends React.Component {

  render() {

    const { item } = this.props;

    let content = item.availability ?

    <Item>
      <Item.Image onClick={ () => this.props.handleitemclick(item) } src={item.image} style={{ cursor: 'pointer' }}/>

      <Item.Content verticalAlign='middle'>
        <Item.Header as='a' onClick={ () => this.props.handleitemclick(item) }>{item.name}</Item.Header>
        <Item.Meta>{item.description}</Item.Meta>
      </Item.Content>
    </Item> :

    <Item>
      <Item.Image src={item.image} />

      <Item.Content verticalAlign='middle'>
        <Item.Header as='a'>{item.name}</Item.Header>
        <Item.Meta>{item.description}</Item.Meta>
        <Item.Extra>{<Header as='h3' color='red'>Out of Stock</Header>}</Item.Extra>
      </Item.Content>
    </Item>;

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default MenuBar;

import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Dimmer, Loader, Item, List } from 'semantic-ui-react';

import MenuBar from './MenuBar';
import ItemPopUp from './ItemPopUp';

import { getAllItems, authenticate } from '../Axios/axios_getter';

class MenuPage extends React.Component {

  state = {
    active: false,
    selected: null,
    loading: false,
    drinks: [],
    food: [],
    add: []
  }

  componentDidMount = () => {
    this.setState({ loading: true });

    getAllItems()
      .then(menu => {
        let allItems = new Map();
        let addons = [];
        for (let i = 0; i < menu.length; i++) {
          let current = menu[i];
          // if item is add-on, handle it differently
          if (current.category == 'Add') {
            let newItem = {
              name: current.item,
              price: current.price
            }
            addons.push(newItem);
          }
          // if item is already in dict, add the new size and price
          if (allItems.has(current.item)) {
            let sp = [current.size, current.price];
            let temp = allItems.get(current.item);
            temp.sp.push(sp);
            allItems.set(current.item, temp);
          }
          // otherwise add a completely new item
          else {
            let newItem = {
              name: current.item,
              sp: [[current.size, current.price]],
              description: current.description,
              category: current.category
            }
            allItems.set(current.item, newItem);
          }
        }
        // separate items into drinks or food
        let drinks = [];
        let food = [];
        for (const [key, value] of allItems) {
          if (allItems.get(key).category == 'Drink') {
            drinks.push(allItems.get(key));
          }
          if (allItems.get(key).category == 'Food') {
            food.push(allItems.get(key));
          }
        }
        this.setState({ drinks: drinks });
        this.setState({ food: food });
        this.setState({ add: addons });
      }
    );
    this.setState({ loading: false });
  }

  handleClose = async () => {
    this.setState({ loading: true });
    await this.setState({ active: false });
    this.setState({ loading: false });
  }

  handleDrinksMenuClick = (e) => {
    // speed scroll to Drinks
  }

  handleFoodMenuClick = (e) => {
    // speed scroll to Food
  }

  handleItemClick = async (item) => {
    this.setState({ loading: true });
    await this.setState({ selected: item });
    await this.setState({ active: true });
    this.setState({ loading: false });

    // speed scroll to Add-ons
  }

  handleItemSubmit = async (item) => {
    this.setState({ loading: true });
    this.props.handleItemSubmit(item);
    this.handleClose()
  }

  render() {

    return (
      <React.Fragment>
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Dimmer active={this.state.active} onClickOutside={this.handleClose} page>
          <Container style={{ width: '720px' }}>
            <ItemPopUp handleClose={this.handleClose} handleItemSubmit={this.handleItemSubmit} item={this.state.selected} add={this.state.add} />
          </Container>
        </Dimmer>

        {/* Side menu
          <Menu vertical secondary fixed='left' color='grey' size='massive'>
          <div style={{ height: '30vh' }} />
          <Menu.Item onClick={this.handleDrinksMenuClick}>
            <div style={{ height: '2vh'}} />
            <Container textAlign='center'>
          <Header as='h2'>
          <Icon name='coffee'/>
          DRINKS
          </Header>
            </Container>
            <div style={{ height: '2vh'}} />
          </Menu.Item>
          <Menu.Item onClick={this.handleFoodMenuClick}>
            <div style={{ height: '2vh'}} />
            <Container textAlign='center'>
          <Header as='h2'>
          <Icon name='utensils'/>
          FOOD
          </Header>
            </Container>
            <div style={{ height: '2vh'}} />
          </Menu.Item>
          </Menu>
        */}

        {/* Main Content */}
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width='4'>
            </Grid.Column>
            <Grid.Column width='10'>
              <Grid divided='vertically'>
                <Grid.Row>
                  <div style={{ height: '3vh' }} />
                  <Header style={{ 'fontSize': '3em' }}>
                    MENU
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width='1'>
                  </Grid.Column>
                  <Grid.Column width='15'>
                    <div style={{ height: '2em' }} />
                    <Grid>
                      {/* Drinks Section */}
                      <Grid.Row>
                        <Header style={{ 'fontSize': '2em' }}>Drinks</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1'>
                        </Grid.Column>
                        <Grid.Column width='15'>

                          <Item.Group>
                            {this.state.drinks.map(drink => {
                              return (
                                <MenuBar
                                  id={drink.name}
                                  handleItemClick={this.handleItemClick}
                                  item={drink}
                                />
                              )})}
                          </Item.Group>

                        </Grid.Column>
                      </Grid.Row>

                      <div style={{ height: '2em' }} />
                      {/* Food Section */}
                      <Grid.Row>
                        <Header style={{ 'fontSize': '2em' }}>Food</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1'>
                        </Grid.Column>
                        <Grid.Column width='15'>

                          <Item.Group>
                            {this.state.food.map(food => {
                              return (
                                <MenuBar
                                  id={food.name}
                                  handleItemClick={this.handleItemClick}
                                  item={food}/>
                              )})}
                          </Item.Group>

                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width='2'>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default MenuPage;

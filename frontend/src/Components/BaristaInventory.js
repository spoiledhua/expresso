import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Dimmer, Loader, Item, List, Responsive, Card, Button, Divider, Checkbox } from 'semantic-ui-react';

import { getAllItems, authenticate } from '../Axios/axios_getter';

class BaristaInventory extends React.Component {
  constructor(props) {
    super(props)
    this.drinkRef = React.createRef()
    this.foodRef = React.createRef()
    this.contextRef = React.createRef()
  }

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
    window.scrollTo(0, this.drinkRef.current.offsetTop)
  }

  handleFoodMenuClick = (e) => {
    // speed scroll to Food
    window.scrollTo(0, this.foodRef.current.offsetTop)
  }

  handleItemClick = async (item) => {
    this.setState({ loading: true });
    await this.setState({ selected: item });
    await this.setState({ active: true });
    this.setState({ loading: false });

  }

  handleItemSubmit = async (item) => {
    this.setState({ loading: true });
    this.props.handleItemSubmit(item);
    this.handleClose()
  }

  handleFeedback = (e) => {
    // link to feedback form
  }

  render() {

    return (
      <React.Fragment>
          <Menu vertical secondary fixed='left' color='grey' size='massive'>
            <div style={{ height: '30vh' }} />
            <Menu.Item onClick={this.handleDrinksMenuClick}>
              <div style={{ height: '2vh' }} />
              <Container textAlign='center'>
                <Header as='h2'>
                  <Icon name='coffee' />
                  DRINKS
                </Header>
              </Container>
              <div style={{ height: '2vh' }} />
            </Menu.Item>
            <Menu.Item onClick={this.handleFoodMenuClick}>
              <div style={{ height: '2vh' }} />
              <Container textAlign='center'>
                <Header as='h2'>
                  <Icon name='utensils' />
                  FOOD
                </Header>
              </Container>
              <div style={{ height: '2vh' }} />
            </Menu.Item>
          </Menu>
          {/* Main Content */}
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width='4' />
              <Grid.Column width='9'>
                <Grid divided='vertically'>
                  <Grid.Row>
                    <div style={{ height: '3vh' }} />
                    <Header style={{ 'fontSize': '3em' }}>
                      INVENTORY
                  </Header>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width='1' />
                    <Grid.Column width='15'>
                      <div style={{ height: '2em' }} />
                      <Grid>
                        {/* Drinks Section */}
                        <div ref={this.drinkRef}></div>
                        <Grid.Row >
                          <Header style={{ 'fontSize': '2em' }}>DRINKS</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width='1' />
                            <Grid.Column width='15'>
                            {this.state.drinks.map(drink => {
                                return (
                                    <Grid.Row>
                                        <h2>{drink.name}</h2> <Checkbox toggle checked label='In Stock' />
                                        <Divider></Divider>
                                    </Grid.Row>
                                )
                              })}
                            </Grid.Column>
                        </Grid.Row>
                        <div style={{ height: '2em' }} />
                        {/* Food Section */}
                        <div ref={this.foodRef}></div>
                        <Grid.Row>
                          <Header style={{ 'fontSize': '2em' }}>FOOD</Header>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width='1' />
                          <Grid.Column width='15'>
                            {this.state.food.map(food => {
                                return (
                                    <Grid.Row>
                                        <h2>{food.name}</h2> <Checkbox toggle checked label='In Stock' />
                                        <Divider></Divider>
                                    </Grid.Row>
                                )
                            })}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width='2'>
              </Grid.Column>
              <Grid.Column width='1' />
            </Grid.Row>
          </Grid>
        
      </React.Fragment>
    );
  }
}

export default BaristaInventory;

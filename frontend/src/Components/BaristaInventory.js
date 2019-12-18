import React from 'react';
import { Image, Menu, Icon, Container, Header, Grid, Dimmer, Loader, Button, Checkbox } from 'semantic-ui-react';

import BaristaHeader from './BaristaHeader';
import AddItem from './AddItem';
import EditItem from './EditItem';
import { getAllItems, changeStock } from '../Axios/axios_getter';
import * as inventory from '../Assets/inventory.png';

class BaristaInventory extends React.Component {
  constructor(props) {
    super(props)
    this.drinkRef = React.createRef()
    this.foodRef = React.createRef()
    this.addonsRef = React.createRef()
    this.contextRef = React.createRef()
  }

  state = {
    addActive: false,
    editActive: false,
    selected: null,
    loading: false,
    drinks: [],
    food: [],
    add: []
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    setTimeout(this.getItems, 1000);
  }

  getItems = async () => {
    await getAllItems()
      .then(menu => {
        let allItems = new Map();
        let addons = [];
        for (let i = 0; i < menu.length; i++) {
          let current = menu[i];
          // if item is add-on, handle it differently
          if (current.category === 'Add') {
            let newItem = {
              name: current.item,
              price: current.price,
              availability: current.availability
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
              category: current.category,
              availability: current.availability
            }
            allItems.set(current.item, newItem);
          }
        }
        // separate items into drinks or food
        let drinks = [];
        let food = [];
        for (const [key, value] of allItems) {
          if (allItems.get(key).category === 'Drink') {
            drinks.push(allItems.get(key));
          }
          if (allItems.get(key).category === 'Food') {
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

  handleAddClick = async () => {
    this.setState({ loading: true });
    await this.setState({ addActive: true });
    this.setState({ loading: false });
  }

  handleAddClose = async () => {
    this.setState({ loading: true });
    await this.setState({ addActive: false });
    this.setState({ loading: false });
  }

  handleEditClick = async (item) => {
    this.setState({ loading: true });
    await this.setState({ selected: item });
    await this.setState({ editActive: true });
    this.setState({ loading: false });
  }

  handleEditClose = async () => {
    this.setState({ loading: true });
    await this.setState({ editActive: false });
    this.setState({ loading: false });
  }

  handleDrinksMenuClick = (e) => {
    window.scrollTo({top: this.drinkRef.current.offsetTop + 155, left: 0, behavior: 'smooth'});
  }

  handleFoodMenuClick = (e) => {
    window.scrollTo({top: this.foodRef.current.offsetTop + 183, left: 0, behavior: 'smooth'});
  }

  handleAddOnsMenuClick = () => {
    window.scrollTo({top: this.addonsRef.current.offsetTop + 183, left: 0, behavior: 'smooth'});
  }

  handleFeedback = (e) => {
    // link to feedback form
  }

  handleStockChange = (item) => {
    this.setState({ loading: true });
    changeStock(item)
      .then(availability => {
        if (availability.category === "Drink") {
          for (let i = 0; i < this.state.drinks.length; i++) {
            if (this.state.drinks[i].name === availability.item) {
              let current = this.state.drinks;
              current[i].availability = availability.availability
              this.setState({ drinks: current });
            }
          }
        }

        if (availability.category === "Food") {
          for (let i = 0; i < this.state.food.length; i++) {
            if (this.state.food[i].name === availability.item) {
              let current = this.state.food;
              current[i].availability = availability.availability
              this.setState({ food: current });
            }
          }
        }

        if (availability.category === "Add") {
          for (let i = 0; i < this.state.add.length; i++) {
            if (this.state.add[i].name === availability.item) {
              let current = this.state.add;
              current[i].availability = availability.availability
              this.setState({ add: current });
            }
          }
        }
      });
    this.setState({ loading: false });
  }

  render() {

    return (
      <React.Fragment>
        <BaristaHeader history={this.props.history} />
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Dimmer active={this.state.addActive} onClickOutside={this.handleAddClose} page>
          <Container style={{ width: '720px' }}>
            <AddItem handleAddClose={this.handleAddClose}/>
          </Container>
        </Dimmer>
        <Dimmer active={this.state.editActive} onClickOutside={this.handleEditClose} page>
          <Container style={{ width: '720px' }}>
            <EditItem handleEditClose={this.handleEditClose} item={this.state.selected}/>
          </Container>
        </Dimmer>
        <Menu vertical secondary fixed='left' color='grey' size='massive' style={{ 'zIndex': '1' }}>
          <div style={{ height: '30vh' }} />
          <Menu.Item onClick={this.handleAddClick}>
            <div style={{ height: '2vh' }} />
            <Container textAlign='center'>
              <Header as='h2' style={{fontFamily:'Avenir'}}>
                <Icon name='plus' />
                ADD ITEM
              </Header>
            </Container>
            <div style={{ height: '2vh' }} />
          </Menu.Item>
          <Menu.Item onClick={this.handleDrinksMenuClick}>
            <div style={{ height: '2vh' }} />
            <Container textAlign='center'>
              <Header as='h2' style={{fontFamily:'Avenir'}}>
                <Icon name='coffee' />
                DRINKS
              </Header>
            </Container>
            <div style={{ height: '2vh' }} />
          </Menu.Item>

          <Menu.Item onClick={this.handleFoodMenuClick}>
            <div style={{ height: '2vh' }} />
            <Container textAlign='center' style={{fontFamily:'Avenir'}}>
              <Header as='h2'>
                <Icon name='utensils' />
                FOOD
              </Header>
            </Container>
            <div style={{ height: '2vh' }} />
          </Menu.Item>

          <Menu.Item onClick={this.handleAddOnsMenuClick}>
            <div style={{ height: '2vh' }} />
            <Container textAlign='center' style={{fontFamily:'Avenir'}}>
              <Header as='h2'>
                <Icon name='plus square outline' />
                ADD-ONS
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
                  <Image src={inventory} style = {{paddingLeft:'1em', marginTop:'-8%'}}/>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width='1' />
                  <Grid.Column width='15'>
                    <div style={{ height: '2em' }} />
                    <Grid>
                      {/* Drinks Section */}
                      <div ref={this.drinkRef}></div>
                      <Grid.Row >
                        <Header style={{fontFamily:'Avenir', fontSize:'2em'}}>DRINKS</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.drinks.map(drink => {
                              return (
                                <Grid.Row>
                                  <Grid.Column width='8'>
                                    <h2>{drink.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    {/* the default should be whatever is in the database */}
                                    <Checkbox toggle checked={drink.availability} label='In Stock' onClick={() => this.handleStockChange(drink.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    <Button circular onClick={() => this.handleEditClick(drink)} basic color='black'>Edit Details</Button>
                                  </Grid.Column>
                                </Grid.Row>
                              )
                            })}
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                      <div style={{ height: '2em' }} />
                      {/* Food Section */}
                      <div ref={this.foodRef}></div>
                      <Grid.Row>
                        <Header style={{fontFamily:'Avenir', fontSize:'2em' }}>FOOD</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.food.map(food => {
                              return (
                                <Grid.Row>
                                  <Grid.Column width='8'>
                                    <h2>{food.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    {/* the default should be whatever is in the database */}
                                    <Checkbox toggle checked={food.availability} label='In Stock' onClick={() => this.handleStockChange(food.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    <Button circular onClick={() => this.handleEditClick(food)} basic color='black'>Edit Details</Button>
                                  </Grid.Column>
                                </Grid.Row>
                              )
                            })}
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                      <div ref={this.addonsRef}></div>
                      <Grid.Row>
                        <Header style={{fontFamily:'Avenir', fontSize: '2em'}}>ADD-ONS</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.add.map(addon => {
                              return (
                                <Grid.Row>
                                  <Grid.Column width='8'>
                                    <h2>{addon.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    {/* the default should be whatever is in the database */}
                                    <Checkbox toggle checked={addon.availability} label='In Stock' onClick={() => this.handleStockChange(addon.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='4'>
                                    <Button circular onClick={() => this.handleEditClick(addon)} basic color='black'
                                      style={{fontFamily:'Avenir'}}>Edit Details</Button>
                                  </Grid.Column>
                                </Grid.Row>
                              )
                            })}
                          </Grid>
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

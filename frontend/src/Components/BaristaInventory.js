import React from 'react';
import { Menu, Icon, Container, Header, Grid, Dimmer, Modal, Loader, Button, Checkbox, Responsive, Card, Image, Sidebar, Segment } from 'semantic-ui-react';

import BaristaHeader from './BaristaHeader';
import AddItem from './AddItem';
import * as inventory from '../Assets/inventory.png';

import { changeStock, deleteItem, loadInventory, checkAdmin } from '../Axios/axios_getter';

class BaristaInventory extends React.Component {
  constructor(props) {
    super(props)
    this.drinkRef = React.createRef()
    this.foodRef = React.createRef()
    this.addonsRef = React.createRef()
    this.contextRef = React.createRef()
  }

  state = {
    admin: false,
    deniedActive: false,
    addActive: false,
    editActive: false,
    deleteConfirm: false,
    toDelete: null,
    loading: false,
    drinks: [],
    food: [],
    add: [],
    transitionAdd: false,
    transitionDelete: false,
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    checkAdmin(JSON.parse(localStorage.getItem('token')))
      .then(res => {
        this.setState({ admin: res.status });
      });
    setTimeout(this.getItems, 1000);
    this.intervalId = setInterval(this.getItems, 10000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  toggleOnAdd = () => {
    this.setState({ transitionAdd: true });
    this.timeoutAdd = setTimeout(() => {this.setState({ transitionAdd: false })}, 3000);
  }

  toggleOnDelete = () => {
    this.setState({ transitionDelete: true });
    this.timeoutDelete = setTimeout(() => {this.setState({ transitionDelete: false })}, 3000);
  }

  getItems = async () => {
    await loadInventory(JSON.parse(localStorage.getItem('token')))
      .then(menu => {
        let allItems = [];
        let drinks = [];
        let food = [];
        let addons = [];
        for (let i = 0; i < menu.length; i++) {
          let current = menu[i];
          if (current.category === 'Drink' && !allItems.includes(current.item)) {
            let newItem = {
              name: current.item,
              availability: current.availability
            }
            drinks.push(newItem);
            allItems.push(current.item)
          }
          else if (current.category === 'Food' && !allItems.includes(current.item)) {
            let newItem = {
              name: current.item,
              availability: current.availability
            }
            food.push(newItem);
            allItems.push(current.item)
          }
          else if (current.category === 'Add' && !allItems.includes(current.item)) {
            let newItem = {
              name: current.item,
              availability: current.availability
            }
            addons.push(newItem);
            allItems.push(current.item)
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
    if (this.state.admin === 'False') {
      this.setState({ deniedActive: true });
    }
    else {
      await this.setState({ addActive: true });
    }
    this.setState({ loading: false });
  }

  handleAddClose = async () => {
    this.setState({ loading: true });
    await this.setState({ addActive: false });
    this.setState({ loading: false });
  }

  handleDeleteClick = async (item) => {
    this.setState({ loading: true });
    if (this.state.admin === 'False') {
      this.setState({ deniedActive: true });
    }
    else {
      await this.setState({ toDelete: item });
      await this.setState({ deleteConfirm: true });
    }
      this.setState({ loading: false });
  }

  deleteItemSubmit = async () => {
    this.setState({ loading: true });
    await deleteItem(this.state.toDelete, JSON.parse(localStorage.getItem('token')));
    this.setState({ toDelete: null });
    this.setState({ deleteConfirm: false });
    await this.getItems();
    this.toggleOnDelete();
    this.setState({ loading: false });
  }

  deleteItemClose = () => {
    this.setState({ deleteConfirm: false });
  }

  handleCloseDenied = () => {
    this.setState({ deniedActive: false });
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

  handleStockChange = (item) => {
    this.setState({ loading: true });
    changeStock(item, JSON.parse(localStorage.getItem('token')))
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

    let content =
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width='4' />
            <Grid.Column width='9'>
              <Grid divided='vertically'>
                <Grid.Row>
                  <Image src={inventory} style = {{marginTop:'-8%'}}/>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width='1' />
                  <Grid.Column width='15'>
                    <div style={{ height: '2em' }} />
                    <Grid>
                      {/* Drinks Section */}
                      <div ref={this.drinkRef}></div>
                      <Grid.Row >
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Header style={{ 'fontSize': '2em' }}>DRINKS</Header>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.drinks.map(drink => {
                              return (
                                <Grid.Row key={drink.name}>
                                  <Grid.Column width='7'>
                                    <h2>{drink.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='6'>
                                    <Checkbox toggle checked={drink.availability} label='In Stock' onClick={() => this.handleStockChange(drink.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='3'>
                                    <Button circular onClick={() => this.handleDeleteClick(drink.name)} basic color='black'>Delete Item</Button>
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
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Header style={{ 'fontSize': '2em' }}>FOOD</Header>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.food.map(food => {
                              return (
                                <Grid.Row key={food.name}>
                                  <Grid.Column width='7'>
                                    <h2>{food.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='6'>
                                    <Checkbox toggle checked={food.availability} label='In Stock' onClick={() => this.handleStockChange(food.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='3'>
                                    <Button circular onClick={() => this.handleDeleteClick(food.name)} basic color='black'>Delete Item</Button>
                                  </Grid.Column>
                                </Grid.Row>
                              )
                            })}
                          </Grid>
                        </Grid.Column>
                      </Grid.Row>
                      <div ref={this.addonsRef}></div>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Header style={{ 'fontSize': '2em' }}>ADD-ONS</Header>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1' />
                        <Grid.Column width='15'>
                          <Grid divided='vertically'>
                            {this.state.add.map(addon => {
                              return (
                                <Grid.Row key={addon.name}>
                                  <Grid.Column width='7'>
                                    <h2>{addon.name}</h2>
                                  </Grid.Column>
                                  <Grid.Column width='6'>
                                    <Checkbox toggle checked={addon.availability} label='In Stock' onClick={() => this.handleStockChange(addon.name)}/>
                                  </Grid.Column>
                                  <Grid.Column width='3'>
                                    <Button circular onClick={() => this.handleDeleteClick(addon.name)} basic color='black'>Delete Item</Button>
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
        </Grid>;

    return (
      <React.Fragment>
        <Sidebar as={Header} direction='top' width='very wide' visible={this.state.transitionAdd} animation='overlay' style={{ 'zIndex': '3' }}>
          <div style={{ height: '5vh' }} />
          <Segment raised textAlign='center' style={{color: 'white', fontFamily:'Avenir', background: '#EDAC86'}}>
            Item added to the menu!
          </Segment>
        </Sidebar>
        <Sidebar as={Header} direction='top' width='very wide' visible={this.state.transitionDelete} animation='overlay' style={{ 'zIndex': '3' }}>
          <div style={{ height: '5vh' }} />
          <Segment raised textAlign='center' style={{color: 'white', fontFamily:'Avenir', background: '#EDAC86'}}>
            Item deleted from the menu!
          </Segment>
        </Sidebar>
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Modal open={this.state.addActive} style={{'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto'}}>
          <Container style={{ width: '720px' }}>
            <AddItem handleAddClose={this.handleAddClose} inventoryRefresh={this.getItems} toggleOnAdd={this.toggleOnAdd} />
          </Container>
        </Modal>
        {/* Pop up to confirm item deletion */}
        <Dimmer active={this.state.deleteConfirm} onClickOutside={this.deleteItemClose} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey'>Are you sure you want to permanently delete this item from the menu?</Header>
              </Card.Content>
              <Button.Group>
                <Button onClick={this.deleteItemClose}>Cancel</Button>
                <Button negative onClick={this.deleteItemSubmit}>Delete</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        <Dimmer active={this.state.deniedActive} onClickOutside={this.handleCloseDenied} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey'>Access denied</Header>
              </Card.Content>
              <Button onClick={this.handleCloseDenied}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        <BaristaHeader history={this.props.history} />
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <div style={{ height: '12vh' }} />
          <Menu vertical secondary fixed='left' color='grey' size='massive' style={{ 'zIndex': '1' }}>
            <div style={{ height: '30vh' }} />
            <Menu.Item onClick={this.handleAddClick}>
              <div style={{ height: '2vh' }} />
              <Container textAlign='center'>
                <Header as='h2'>
                  <Icon name='plus' />
                  ADD ITEM
                </Header>
              </Container>
              <div style={{ height: '2vh' }} />
            </Menu.Item>
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

            <Menu.Item onClick={this.handleAddOnsMenuClick}>
              <div style={{ height: '2vh' }} />
              <Container textAlign='center'>
                <Header as='h2'>
                  <Icon name='plus square outline' />
                  ADD-ONS
                </Header>
              </Container>
              <div style={{ height: '2vh' }} />
            </Menu.Item>
          </Menu>
          {content}
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
        <div style={{ height: '7vh' }} />
          {content}
        </Responsive>
      </React.Fragment>
    );
  }
}

export default BaristaInventory;

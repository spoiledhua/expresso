import React from 'react';
import { Menu, Icon, Container, Header, Grid, Dimmer, Loader, Item, Responsive, Modal, Image, Sidebar, Segment, Message } from 'semantic-ui-react';

import MenuBar from './MenuBar';
import ItemPopUp from './ItemPopUp';
import ClientHeader from './ClientHeader';
import Footer from './Footer';
import * as menu from '../Assets/menu.png';

import { getAllItems, getStoreStatus } from '../Axios/axios_getter';

class MenuPage extends React.Component {

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
    shoppingCart: [],
    transition: false,
    storeStatusMessage: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.loadMenu();
    await getStoreStatus(JSON.parse(localStorage.getItem('token')))
      .then(data => {
        if (!data.status) {
          this.setState({ storeStatusMessage: true });
        }
      });
  }

  handleCloseStoreClosed = () => {
    this.setState({ storeStatusMessage: false });
  }

  loadMenu = async () => {

    await getAllItems(JSON.parse(localStorage.getItem('token')))
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
            let image = 'data:image/png;base64,' + current.image;
            let newItem = {
              name: current.item,
              sp: [[current.size, current.price]],
              description: current.description,
              category: current.category,
              image: image,
              availability: current.availability,
              definition: current.definition
            }
            allItems.set(current.item, newItem);
          }
        }
        // separate items into drinks or food
        let drinks = [];
        let food = [];
        for (const [key] of allItems) {
          if (allItems.get(key).category === 'Drink') {
            const current = allItems.get(key);
            current.addons = addons;
            drinks.push(current);
          }
          if (allItems.get(key).category === 'Food') {
            const current = allItems.get(key);
            current.addons = [];
            food.push(current);
          }
        }
        this.setState({ drinks: drinks });
        this.setState({ food: food });
      }
      );

    if (JSON.parse(localStorage.getItem('shoppingCart')) !== null) {
      this.setState({ shoppingCart: JSON.parse(localStorage.getItem('shoppingCart'))});
    }
    this.setState({ loading: false });
  }

  toggleOn = () => {
    this.setState({ transition: true });
    this.timeout = setTimeout(() => {this.setState({ transition: false })}, 3000);
  }

  handleAddItem = async (item) => {
    await this.setState({ loading: true });
    if (this.state.shoppingCart.length === 0) {
      item.id = 0;
    }
    else {
      item.id = this.state.shoppingCart[this.state.shoppingCart.length - 1].id + 1;
    }
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart.push(item);
      return { shoppingCart }
    });

    await this.setState({ loading: false });
  }

  handleClose = async () => {
    await this.setState({ loading: true });
    await this.setState({ active: false });
    await this.setState({ selected: null });
    await this.setState({ loading: false });
  }

  handleDrinksMenuClick = () => {
    // speed scroll to Drinks
    window.scrollTo({top: this.drinkRef.current.offsetTop + 350, left: 0, behavior: 'smooth'});
  }

  handleFoodMenuClick = () => {
    // speed scroll to Food
    window.scrollTo({top: this.foodRef.current.offsetTop + 380, left: 0, behavior: 'smooth'});
  }

  handleItemClick = async (item) => {
    await this.setState({ loading: true });
    await this.setState({ selected: item });
    await this.setState({ active: true });
    await this.setState({ loading: false });
  }

  handleItemSubmit = async (item) => {
    await this.setState({ loading: true });
    await this.handleAddItem(item);
    await this.handleClose();
    localStorage.setItem('shoppingCart', JSON.stringify(this.state.shoppingCart));
    this.toggleOn();
    await this.setState({ loading: false });
  }

  handleFeedback = (e) => {
    window.open('https://forms.gle/6rxsKdj2gh3yPbXV8');
  }

  render() {

    return (
      <React.Fragment>
        <Sidebar as={Header} direction='top' width='very wide' visible={this.state.transition} animation='overlay' style={{ 'zIndex': '1' }}>
          <div style={{ height: '5vh' }} />
          <Segment raised textAlign='center' style={{color: 'white', fontFamily:'Avenir', background: '#EDAC86'}}>
            Item added to cart!
          </Segment>
        </Sidebar>
        <ClientHeader history={this.props.history} shoppingCart={this.state.shoppingCart} />
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Modal open={this.state.active} style={{'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto'}}>
          <ItemPopUp handleItemSubmit={this.handleItemSubmit} handleclose={this.handleClose} item={this.state.selected} />
        </Modal>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu vertical secondary style={{ width: '23vw', 'zIndex': '1' }} fixed='left' size='massive'>
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
            {this.state.storeStatusMessage ?
              <React.Fragment>
                <div style={{ height: '5vh' }} />
                <Grid.Row>
                  <Grid.Column width='4' />
                  <Grid.Column width='9'>
                    <Message onDismiss={this.handleCloseStoreClosed} content='Ordering is disabled because the Coffee Club is currently closed. Feel free to browse our website.' style={{ fontFamily: 'Avenir', textAlign: 'center'}} />
                  </Grid.Column>
                </Grid.Row>
                <div style={{ height: '7vh' }} />
              </React.Fragment>
            : <div style={{ height: '12vh' }} />
            }
            <Grid.Row>
              <Grid.Column width='4' />
              <Grid.Column width='9'>
                <Grid divided='vertically'>
                  <Grid.Row>
                    <Image src={menu} style={{ paddingLeft:'1em', marginTop:'-8%' }}/>
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
                            <Item.Group>
                              {this.state.drinks.map(drink => {
                                return (
                                  <MenuBar key={drink.name} id={drink.name} item={drink} handleitemclick={this.handleItemClick} />
                                )
                              })}
                            </Item.Group>
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
                            <Item.Group>
                              {this.state.food.map(food => {
                                return (
                                  <MenuBar key={food.name} id={food.name} handleitemclick={this.handleItemClick} item={food} />
                                )
                              })}
                            </Item.Group>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width='1' />
            </Grid.Row>
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Grid stackable>
            {this.state.storeStatusMessage ?
              <React.Fragment>
                <div style={{ height: '5vh' }} />
                <Grid.Row>
                  <Grid.Column width='4' />
                  <Grid.Column width='9'>
                    <Message onDismiss={this.handleCloseStoreClosed} content='Ordering is disabled because the Coffee Club is currently closed. Feel free to browse our website.' style={{ fontFamily: 'Avenir', textAlign: 'center'}} />
                  </Grid.Column>
                </Grid.Row>
              </React.Fragment>
            : <div style={{ height: '7vh' }} />
            }
            <Grid.Row>
              <Grid.Column>
                <Grid divided='vertically'>
                  <Grid.Row>
                    <Image src={menu} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width='1' />
                    <Grid.Column width='15'>
                      <Grid>
                        {/* Drinks Section */}
                        <Grid.Row >
                          <div style={{ width: '12vw' }} />
                          <Header style={{ 'fontSize': '2em' }}>DRINKS</Header>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width='1' />
                          <Grid.Column width='15'>
                            <Item.Group>
                              {this.state.drinks.map(drink => {
                                return (
                                  <MenuBar key={drink.name} handleitemclick={this.handleItemClick} id={drink.name} item={drink} />
                                )
                              })}
                            </Item.Group>
                          </Grid.Column>
                        </Grid.Row>
                        {/* Food Section */}
                        <Grid.Row>
                          <div style={{ width: '12vw' }} />
                          <Header style={{ 'fontSize': '2em' }}>FOOD</Header>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width='1' />
                          <Grid.Column width='15'>
                            <Item.Group>
                              {this.state.food.map(food => {
                                return (
                                  <MenuBar
                                    key={food.name} id={food.name} handleitemclick={this.handleItemClick} item={food} />
                                )
                              })}
                            </Item.Group>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width='2'/>
            </Grid.Row>
          </Grid>
        </Responsive>
        <div style={{ height: '15vh' }} />
        <Footer />
      </React.Fragment>
    );
  }
}

export default MenuPage;

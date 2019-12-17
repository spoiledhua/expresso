import React from 'react';
import { Menu, Icon, Container, Header, Grid, Dimmer, Loader, Item, Responsive, Card, Button, Modal } from 'semantic-ui-react';

import MenuBar from './MenuBar';
import ItemPopUp from './ItemPopUp';

import { getAllItems } from '../Axios/axios_getter';

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
    food: []
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
    this.setState({ loading: false });
  }

  handleClose = async () => {
    await this.setState({ loading: true });
    await this.setState({ active: false });
    await this.setState({ selected: null });
    await this.setState({ loading: false });
  }

  handleDrinksMenuClick = () => {
    // speed scroll to Drinks
    window.scrollTo({top: this.drinkRef.current.offsetTop + 155, left: 0, behavior: 'smooth'});
  }

  handleFoodMenuClick = () => {
    // speed scroll to Food
    window.scrollTo({top: this.foodRef.current.offsetTop + 183, left: 0, behavior: 'smooth'});
  }

  handleItemClick = async (item) => {
    await this.setState({ loading: true });
    await this.setState({ selected: item });
    await this.setState({ active: true });
    await this.setState({ loading: false });
  }

  handleItemSubmit = async (item) => {
    await this.setState({ loading: true });
    await this.props.handleItemSubmit(item);
    await this.handleClose();
    await this.setState({ loading: false });
  }

  handleFeedback = (e) => {
    window.open('https://forms.gle/6rxsKdj2gh3yPbXV8');
  }

  render() {

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Dimmer active={this.state.loading} inverted page>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Modal open={this.state.active} item={this.state.selected} page>
            <ItemPopUp handleItemSubmit={this.handleItemSubmit} handleclose={this.handleClose} item={this.state.selected} />
          </Modal>
          <Dimmer.Dimmable>
            <Menu vertical secondary style={{ width: '23vw' }} fixed='left' size='massive' style={{ 'zIndex': '1' }}>
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
                      <Header style={{ 'fontSize': '3em' }}>
                        MENU
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
                              <Item.Group>
                                {this.state.drinks.map(drink => {
                                  return (
                                    <MenuBar id={drink.name} item={drink} handleitemclick={this.handleItemClick} />
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
                                    <MenuBar id={food.name} handleitemclick={this.handleItemClick} item={food} />
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
                <Grid.Column width='2'>
                  {/*<Ref innerRef={this.contextRef}>
                    <Rail position='right'>
                  <Sticky context={this.contextRef}>*/}
                  <Card raised>
                    <Card.Content textAlign='center'>
                      Loving online ordering? Leave us some feedback
                      <Button circular size='mini' basic color='black' onClick={this.handleFeedback}>HERE</Button>
                    </Card.Content>
                  </Card>
                  {/*</Sticky>
                    </Rail>
                  </Ref>*/}
                </Grid.Column>
                <Grid.Column width='1' />
              </Grid.Row>
            </Grid>
          </Dimmer.Dimmable>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Dimmer active={this.state.loading} inverted page>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Modal open={this.state.active} item={this.state.selected} page>
            <ItemPopUp handleItemSubmit={this.handleItemSubmit} handleclose={this.handleClose} item={this.state.selected} />
          </Modal>
          {/* Main Content */}
          <Dimmer.Dimmable>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column>
                  <Grid divided='vertically'>
                    <Grid.Row>
                      <div style={{ width: '8vw' }} />
                      <Header style={{ 'fontSize': '3em' }}>
                        MENU
                      </Header>
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
                                    <MenuBar handleitemclick={this.handleItemClick} id={drink.name} item={drink} />
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
                                      id={food.name} handleitemclick={this.handleItemClick} item={food} />
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
          </Dimmer.Dimmable>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default MenuPage;

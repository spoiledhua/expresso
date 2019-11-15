import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Dimmer, Item, List } from 'semantic-ui-react';

import MenuBar from './MenuBar';
import ClientHeader from './ClientHeader';
import ItemPopUp from './ItemPopUp';

import { getAllItems } from '../Axios/axios_getter';

class MenuPage extends React.Component {

  state = {
    active: false,
    drinks: []
  }

  renderMenu = () => {
    getAllItems()
      .then(menu => {
        let drinks = [];
        let food = [];
        console.log(menu)
        for (let i = 0; i < menu.length; i++) {
          if (menu[i].category == 'Drink') drinks.push(menu[i]);
          if (menu[i].category == 'Food') food.push(menu[i]);
        }
      this.setState({ drinks: drinks });
      this.setState({ food: food });
    });
  }

  componentDidMount = () => {
    this.renderMenu();
  }

  handleClose = (e, { active }) => {
    this.setState({ active: false });
  }

  handleDrinksMenuClick = (e) => {
    // speed scroll to Drinks
  }

  handleFoodMenuClick = (e) => {
    // speed scroll to Food
  }

  handleItemClick = (e) => {
    this.setState({ active: true })
    // speed scroll to Add-ons
  }

  render() {

    return (
      <React.Fragment>
        <Dimmer active={this.state.active} onClickOutside={this.handleClose} page>
          <ItemPopUp handleClose={this.handleClose}/>
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
        <Grid>
          <Grid.Row>
            <Grid.Column width='4'>
            </Grid.Column>
            <Grid.Column width='10'>
              <Grid divided='vertically'>
                <Grid.Row>
                  <div style={{ height: '3vh' }} />
                  <Header style={{ 'font-size': '3em' }}>
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
                        <Header style={{ 'font-size': '2em' }}>Drinks</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1'>
                        </Grid.Column>
                        <Grid.Column width='15'>

                          <Item.Group>
                            {this.state.drinks.map(item => {
                              return <MenuBar name={item} price={item} />
                            })}
                          </Item.Group>

                        </Grid.Column>
                      </Grid.Row>

                      <div style={{ height: '2em' }} />
                      {/* Food Section */}
                      <Grid.Row>
                        <Header style={{ 'font-size': '2em' }}>Food</Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width='1'>
                        </Grid.Column>
                        <Grid.Column width='15'>

                          <Item.Group>
                            {this.state.drinks.map(item => {
                              return <MenuBar name={item} price={item} />
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default MenuPage;

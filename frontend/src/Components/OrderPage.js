import React from 'react';
import { Card, Container, Header, Grid, Button, Radio, Form, Divider, Dimmer, Loader, Dropdown } from 'semantic-ui-react';

import ClientHeader from './ClientHeader';

import { postMakeOrder, getUser, getStoreStatus } from '../Axios/axios_getter';

class OrderPage extends React.Component {

  state = {
    user: null,
    chargeEligible: null,
    availabilityConfirm: false,
    outOfStock: null,
    payment: true,
    totalPrice: 0,
    shoppingCart: [],
    toBeRemoved: null,
    emptyPopUp: false,
    eligibilityPopUp: false,
    confirm: false,
    remove: false,
    place: false,
    storeStatus: false,
    storeStatusPopUp: false,
    timePopUp: false,
    time: null,
    loading: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    setTimeout(this.setInitial, 1000);
  }

  setInitial = async () => {
    if (JSON.parse(localStorage.getItem('shoppingCart')) !== null) {
      await this.setState({ shoppingCart: JSON.parse(localStorage.getItem('shoppingCart'))});
    }
    this.setState({ totalPrice: this.getPrice() });
    await getUser(JSON.parse(localStorage.getItem('token')))
      .then(user => {
        this.setState({ user: user.user });
        this.setState({ chargeEligible: user.charge_eligible });
        localStorage.setItem('token', JSON.stringify(user.token));
      });
    await getStoreStatus(JSON.parse(localStorage.getItem('token')))
      .then(data => {
        this.setState({ storeStatus: data.status });
      });
    this.setState({ loading: false });
  }

  getPrice = () => {
    let { shoppingCart } = this.state;
    let price = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      price += Number(shoppingCart[i].sp[1]);
      for (let j = 0; j < shoppingCart[i].addons.length; j++) {
        price += Number(shoppingCart[i].addons[j].price);
      }
    }
    return price;
  }

  handleFilterItem = async (id) => {
    await this.setState({ loading: true });
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart = shoppingCart.filter(item => item.id !== id);
      return { shoppingCart }
    });
    await this.setState({ loading: false });
  }

  handleRemoveItem = (id) => {
    this.setState({ toBeRemoved: id });
    this.setState({ remove: true });
  }

  handleConfirmRemove = async () => {
    await this.handleFilterItem(this.state.toBeRemoved);
    this.setState({ totalPrice: this.getPrice() });
    localStorage.setItem('shoppingCart', JSON.stringify(this.state.shoppingCart));
    this.handleCloseConfirmRemove();
  }

  emptyCart = async () => {
    await this.setState({ shoppingCart: [] });
    localStorage.setItem('shoppingCart', JSON.stringify(this.state.shoppingCart));
  }

  selectPayment = (payment) => {
    this.setState({ payment: payment });
  }

  handlePlaceOrder = async () => {
    this.setState({ loading: true });
    await getStoreStatus(JSON.parse(localStorage.getItem('token')))
      .then(data => {
        this.setState({ storeStatus: data.status });
    });
    if (this.state.shoppingCart.length === 0) {
      this.setState({ emptyPopUp: true });
      this.handleCloseConfirm();
    }
    else if (this.state.time === null) {
      this.setState({ timePopUp: true });
      this.handleCloseConfirm();
    }
    else {
      if (this.state.time !== 'Now') {
        let orderTime = new Date();
        const orderTimeSplit = this.state.time.split(':');
        if (orderTimeSplit[0] < 5) {
          orderTimeSplit[0] = Number(orderTimeSplit[0]) + 12;
          orderTimeSplit[0] = orderTimeSplit[0].toString();
        }
        orderTime.setHours(orderTimeSplit[0], orderTimeSplit[1], 0);
        const currentTime = new Date();
        if (orderTime <= currentTime) {
          this.setState({ invalidTime: true });
          this.handleCloseConfirm();
        }
        else {
          if (!this.state.chargeEligible && this.state.payment) {
            this.setState({ eligibilityPopUp: true });
            this.handleCloseConfirm();
          }
          else if (!this.state.storeStatus) {
            this.setState({ storeStatusPopUp: true });
            this.handleCloseConfirm();
          }
          else {
            this.setState({ confirm: true });
          }
        }
      }
      else {
        if (!this.state.chargeEligible && this.state.payment) {
          this.setState({ eligibilityPopUp: true });
          this.handleCloseConfirm();
        }
        else if (!this.state.storeStatus) {
          this.setState({ storeStatusPopUp: true });
          this.handleCloseConfirm();
        }
        else {
          this.setState({ confirm: true });
        }
      }
    }
    this.setState({ loading: false });
  }

  postOrder = async (payment) => {

    const { shoppingCart } = this.state;

    await this.setState({ loading: true });

    let items = [];
    for (let i = 0; i < shoppingCart.length; i++) {
      const item = shoppingCart[i];
      let addons = []
      for (let j = 0; j < item.addons.length; j++) {
        const addon = { name: item.addons[j].name };
        addons.push(addon);
      }
      const update = {
        item: { name: item.item.name },
        addons: addons,
        sp: item.sp[0]
      }
      items.push(update);
    }

    let time = this.state.time;

    if (time !== 'Now') {
      time = time.split(':');
      let hours = Number(time[0]);

      let timeValue;

      if (hours <= 5) {
        timeValue = "" + (hours + 12);
      }
      else {
        timeValue= "" + hours;
      }
      timeValue += ':' + time[1];
      time = timeValue;
    }

    const finalUpdate = {
      netid: this.state.user,
      cost: this.getPrice(),
      payment: payment,
      status: payment,
      items: items,
      time: time
    };
    postMakeOrder(this.state.user, finalUpdate, JSON.parse(localStorage.getItem('token')))
      .then(data => {
        if (!data.availability) {
          this.setState({ availabilityConfirm: true });
          this.setState({ outOfStock: data.item });
        }
        else {
          this.emptyCart();
          this.setState({ totalPrice: this.getPrice() });
          this.setState({ place: true });
        }
      });
    this.setState({ loading: false });
  }

  handleConfirm = async () => {
    this.setState({ loading: true });
    await this.postOrder(this.state.payment);
    await this.handleCloseConfirm();
    this.setState({ loading: false });
  }

  handleConfirmPlace = () => {
    this.setState({ place: true });
  }

  handleCloseConfirmPlace = () => {
    this.setState({ place: false });
    this.props.history.push('/menu');
  }

  handleCloseEmpty = () => {
    this.setState({ emptyPopUp: false });
  }

  handleCloseEligibility = () => {
    this.setState({ eligibilityPopUp: false });
  }

  handleCloseConfirm = () => {
    this.setState({ confirm: false });
  }

  handleCloseAvailability = () => {
    this.setState({ availabilityConfirm: false });
    this.setState({ outOfStock: null });
  }

  handleCloseConfirmRemove = () => {
    this.setState({ toBeRemoved: null });
    this.setState({ remove: false });
  }

  handleCloseStoreClosed = () => {
    this.setState({ storeStatusPopUp: false });
  }

  handleCloseTime = () => {
    this.setState({ timePopUp: false });
  }

  handleChangeTime = (e, { value }) => {
    this.setState({ time: value });
  }

  handleCloseInvalidTime = () => {
    this.setState({ invalidTime: false });
  }

  render() {

    const options = [
      { key: 'Now', value: 'Now', text: 'Now'},
      { key: '10:00 AM', value: '10:00', text: '10:00 AM'},
      { key: '10:15 AM', value: '10:15', text: '10:15 AM'},
      { key: '10:30 AM', value: '10:30', text: '10:30 AM'},
      { key: '10:45 AM', value: '10:45', text: '10:45 AM'},
      { key: '11:00 AM', value: '11:00', text: '11:00 AM'},
      { key: '11:15 AM', value: '11:15', text: '11:15 AM'},
      { key: '11:30 AM', value: '11:30', text: '11:30 AM'},
      { key: '11:45 AM', value: '11:45', text: '11:45 AM'},
      { key: '12:00 PM', value: '12:00', text: '12:00 PM'},
      { key: '12:15 PM', value: '12:15', text: '12:15 PM'},
      { key: '12:30 PM', value: '12:30', text: '12:30 PM'},
      { key: '12:45 PM', value: '12:45', text: '12:45 PM'},
      { key: '1:00 PM', value: '1:00', text: '1:00 PM'},
      { key: '1:15 PM', value: '1:15', text: '1:15 PM'},
      { key: '1:30 PM', value: '1:30', text: '1:30 PM'},
      { key: '1:45 PM', value: '1:45', text: '1:45 PM'},
      { key: '2:00 PM', value: '2:00', text: '2:00 PM'},
      { key: '2:15 PM', value: '2:15', text: '2:15 PM'},
      { key: '2:30 PM', value: '2:30', text: '2:30 PM'},
      { key: '2:45 PM', value: '2:45', text: '2:45 PM'},
      { key: '3:00 PM', value: '3:00', text: '3:00 PM'},
      { key: '3:15 PM', value: '3:15', text: '3:15 PM'},
      { key: '3:30 PM', value: '3:30', text: '3:30 PM'},
      { key: '3:45 PM', value: '3:45', text: '3:45 PM'},
      { key: '4:00 PM', value: '4:00', text: '4:00 PM'},
      { key: '4:15 PM', value: '4:15', text: '4:15 PM'},
      { key: '4:30 PM', value: '4:30', text: '4:30 PM'},
      { key: '4:45 PM', value: '4:45', text: '4:45 PM'},
    ]

    let currentOrder = (this.state.shoppingCart === 0) ?
    <Header as='h3'>
      Your order will show up here!
    </Header> :

    this.state.shoppingCart.map(item => {
      return (
        <React.Fragment key={item.id}>
          <Grid.Row>
            <Grid.Column width='6'>
              <Header as='h3' color='grey'>{item.item.name}</Header>
            </Grid.Column>
            <Grid.Column width='4'>
              <Header as='h3' color='grey'>{"$" + Number(item.sp[1]).toFixed(2)}</Header>
            </Grid.Column>
            <Grid.Column width='6'>
              <Button circular icon='close' size='mini' onClick={() => this.handleRemoveItem(item.id)}/>
            </Grid.Column>
          </Grid.Row>
          {item.addons.map(addon => {
            return (

              <Grid.Row key={addon.name}>
                <Grid.Column width='1' />
                <Grid.Column width='5'>
                  <span>{"+ " + addon.name}</span>
                </Grid.Column>
                <Grid.Column width='4'>
                  <Header as='h3' color='grey'>{"$" + Number(addon.price).toFixed(2)}</Header>
                </Grid.Column>
                <Grid.Column width='6' />
              </Grid.Row>
            )
          })}
          <Divider />
        </React.Fragment>
      )
    });

    return (
      <React.Fragment>
        <ClientHeader history={this.props.history} shoppingCart={this.state.shoppingCart} />
        {/* Pop up to confirm empty cart */}
        <Dimmer active={this.state.emptyPopUp} onClickOutside={this.handleCloseEmpty} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Add something to your cart to fuel your grind.</Header>
              </Card.Content>
              <Button onClick={this.handleCloseEmpty} style={{fontFamily:'Avenir'}}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm time selection */}
        <Dimmer active={this.state.timePopUp} onClickOutside={this.handleCloseTime} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Please select an order time.</Header>
              </Card.Content>
              <Button onClick={this.handleCloseTime} style={{fontFamily:'Avenir'}}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm invalid time selection */}
        <Dimmer active={this.state.invalidTime} onClickOutside={this.handleCloseInvalidTime} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>The order time you've selected is invalid.</Header>
              </Card.Content>
              <Button onClick={this.handleCloseInvalidTime} style={{fontFamily:'Avenir'}}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm charge ineligibility*/}
        <Dimmer active={this.state.eligibilityPopUp} onClickOutside={this.handleCloseEligibility} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Sorry, you're not eligible for the student charge option. Please select 'Pay at Store' to place your order.</Header>
              </Card.Content>
              <Button onClick={this.handleCloseEligibility}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm out of stock */}
        <Dimmer active={this.state.availabilityConfirm} onClickOutside={this.handleCloseAvailability} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>{'Sorry, the ' + this.state.outOfStock + ' is out of stock. Please remove it from your cart to place your order.'}</Header>
              </Card.Content>
              <Button onClick={this.handleCloseAvailability}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm store is not accepting orders */}
        <Dimmer active={this.state.storeStatusPopUp} onClickOutside={this.handleCloseStoreClosed} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Ordering is disabled because the Coffee Club is currently closed. Feel free to browse our website.</Header>
              </Card.Content>
              <Button onClick={this.handleCloseStoreClosed} style={{fontFamily:'Avenir'}}>
                Close Window
              </Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm order */}
        <Dimmer active={this.state.confirm} onClickOutside={this.handleCloseConfirm} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Are you sure you're all finished?</Header>
                <Header as='h4' color='black' style={{fontFamily:'Avenir'}}>
                  Clicking “All Set!” below WILL charge your student account if you selected student charge.
                  If you selected to “Pay at Store” and do not pay before the end of the day, your student
                  account will be charged.
                </Header>
              </Card.Content>
              <Button.Group>
                <Button onClick={this.handleCloseConfirm}>Cancel</Button>
                <Button positive onClick={this.handleConfirm} style={{backgroundColor:'#85A290'}}>All Set!</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm removal */}
        <Dimmer active={this.state.remove} onClickOutside={this.handleCloseConfirmRemove} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Are you sure want to remove this from your cart?</Header>
              </Card.Content>
              <Button.Group>
                <Button onClick={this.handleCloseConfirmRemove}>Cancel</Button>
                <Button negative onClick={() => this.handleConfirmRemove()}>Remove</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        {/* Pop up to confirm order has been placed */}
        <Dimmer active={this.state.place} onClickOutside={this.handleCloseConfirmPlace} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>
                  Your order has been placed! It should be ready in around 5-10 minutes.
                  You'll receive an email with the details of your order. Make your way
                  to the Coffee Club to pick up your order!
                </Header>
              </Card.Content>
              <Button onClick={this.handleCloseConfirmPlace}>Return to Menu</Button>
            </Card>
          </Container>
        </Dimmer>
        {/* Dimmer for loading */}
        <Dimmer active={this.state.loading} page inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>

        {/* Main component */}
        <div style={{ height: '12vh' }} />
        <Container style={{ width: '720px' }}>
          <Card fluid style={{padding:'5%'}}>
            <Card.Content>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Header as='h2' style={{fontFamily:'Didot', fontStyle:'italic', color:'black'}}>1. ORDER</Header>
                  </Grid.Column>
                </Grid.Row>
                {currentOrder}
              </Grid>
              <Grid>
                <Grid.Row>
                  <Grid.Column width='3'>
                    <Header as='h3' style={{fontFamily:'Avenir', color:'black'}}>Total</Header>
                  </Grid.Column>
                  <Grid.Column width='3' />
                  <Grid.Column>
                    <Header as='h3' color='black'>{"$" + this.state.totalPrice.toFixed(2)}</Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
            <Card.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Header as='h2' style={{'fontFamily':'Didot', 'fontStyle':'italic', 'color':'black', 'paddingTop':'1em'}}>2. PAYMENT</Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form>
                      <Form.Field>
                        <Radio
                          label='Student Charge'
                          name='payment'
                          checked={this.state.payment}
                          onChange={() => this.selectPayment(true)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Pay at Store'
                          name='payment'
                          checked={!this.state.payment}
                          onChange={() => this.selectPayment(false)}
                        />
                      </Form.Field>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
            <Card.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Header as='h2' style={{'fontFamily':'Didot', 'fontStyle':'italic', 'color':'black', 'paddingTop':'1em'}}>3. TIME</Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Dropdown placeholder='Select Time' fluid selection search scrolling options={options} value={this.state.time} onChange={this.handleChangeTime}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
            <div>
              <Button floated='right' style={{backgroundColor:'#EDAC86'}} onClick={this.handlePlaceOrder}>
                PLACE ORDER
              </Button>
            </div>
          </Card>
        </Container>
      </React.Fragment>

    );
  }
}

export default OrderPage;

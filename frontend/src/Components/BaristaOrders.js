import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Button, Divider, Dimmer, Loader, Card} from 'semantic-ui-react';

import { getBaristaOrders, postInProgress, postComplete, postPaid } from '../Axios/axios_getter';

// idk how to make these render for a couple of seconds so they have an 'x' out button :/
const Progress = ({handleProgressClose}) => {
  return (
    <Card centered>
      <Card.Content>
        <Grid>
          <Grid.Row>
            <Grid.Column width='14'/>
            <Grid.Column width='2'>
              <Button circular icon='close' size='medium' floated='right' onClick={handleProgressClose} basic color='black'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <h2 style={{color:'black'}}>Order in progress ✅</h2>
        <br/><br/><br/>
      </Card.Content>
    </Card>
  )
}

const Complete = ({handleCompleteClose}) => {
  return (
    <Card centered>
      <Card.Content>
        <Grid>
          <Grid.Row>
            <Grid.Column width='14'/>
            <Grid.Column width='2'>
              <Button circular icon='close' size='medium' floated='right' onClick={handleCompleteClose} basic color='black'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <h2 style={{color:'black'}}>Order complete ✅</h2>
        <br/><br/><br/>
      </Card.Content>
    </Card>
  )
}

const Paid = ({handlePaidClose}) => {
  return (
    <Card centered>
      <Card.Content>
        <Grid>
          <Grid.Row>
            <Grid.Column width='14'/>
            <Grid.Column width='2'>
              <Button circular icon='close' size='medium' floated='right' onClick={handlePaidClose} basic color='black'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <h2 style={{color:'black'}}>Order paid ✅</h2>
        <br/><br/><br/>
      </Card.Content>
    </Card>
  )
}

class BaristaOrders extends React.Component {
  _ProgressTimeoutID = null;
  _CompleteTimeoutID = null;
  _PaidTimeoutID = null;

  state = {
    allOrders: [],
    loading: false,
    progressActive: false,
    completeActive: false,
    paidActive : false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    this.getPendingOrders();
    this.setState({ loading: false });
    let intervalFunction = setInterval(this.getPendingOrders, 10000);
  }

  getPendingOrders = async () => {
    await getBaristaOrders()
      .then(allOrders => {
        this.setState({ allOrders: allOrders });
        // console.log(this.state.allOrders);
      })
      .catch(error => {
        console.log(error);
        this.setState({ allOrders: [] });
      });
  }

  handleInProgress = (id) => {
    this.setState({ loading: true });
    postInProgress(id);
    this.setState({progressActive: true})
    this._ProgressTimeoutID = setTimeout(() => {
      this.setState({progressActive: false})
    }, 2000);
    this.setState({ loading: false });
  }

  handleComplete = (id) => {
    this.setState({ loading: true });
    postComplete(id);
    this.setState({completeActive: true})
    this._CompleteTimeoutID = setTimeout(() => {
      this.setState({completeActive: false})
    }, 2000);
    this.setState({ loading: false });
  }

  handlePaid = (id) => {
    this.setState({ loading: true });
    postPaid(id);
    this._PaidTimeoutID = setTimeout(() => {
      this.setState({paidActive: false})
    }, 2000);
    this.setState({paidActive: true})
    this.setState({ loading: false });
  }

  handleProgressClose = () => {
    this.setState({ progressActive: false });
  }

  handleCompleteClose = () => {
    this.setState({ completeActive: false });
  }

  handlePaidClose = () => {
    this.setState({ paidActive: false });
  }

  componentWillUnmount() {
    clearTimeout(this._ProgressTimeoutID);
    clearTimeout(this._CompleteTimeoutID);
    clearTimeout(this._PaidTimeoutID);
  }

  render() {

    const { allOrders } = this.state;

    let pendingOrders = (allOrders.length === 0) ?
    <Header as='h3'>
      No pending orders
    </Header> :
  
    this.state.allOrders.map(order => {
      if (order.payment) {
      return (
        <React.Fragment>
          <Dimmer active={this.state.progressActive} onClickOutside={this.handleProgressClose} page>
            <Container>
              <Progress handleProgressClose={this.handleProgressClose}/>
            </Container>
          </Dimmer>
          <Dimmer active={this.state.completeActive} onClickOutside={this.handleCompleteClose} page>
            <Container>
              <Complete handleCompleteClose={this.handleCompleteClose}/>
            </Container>
          </Dimmer>
          <Dimmer active={this.state.paidActive} onClickOutside={this.handlePaidClose} page>
            <Container>
              <Paid handlePaidClose={this.handlePaidClose}/>
            </Container>
          </Dimmer>
          <Grid.Row>
            <Grid.Column verticalAlign='middle' width='2' style={{textAlign:'center'}}>
              <h1>{order.orderid}</h1>
            </Grid.Column>
            <Grid.Column width='6'>
              {order.item.map(subitem => {
                return (
                  <React.Fragment>
                    <h2 style={{margin: '0'}}>{subitem}</h2>
                    <Divider />
                  </React.Fragment>
                )
              })}
              <h3 style={{margin: '0'}}>{order.netid}</h3>
              <p>{order.time}</p>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
              {/* disable in progress button after order is in progress*/}
              <Button circular disable={order.progress === 1 || order.progress === 2} onClick={() => this.handleInProgress(order.orderid)} style={{background: '#F98F69'}}>IN PROGRESS</Button>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
              <Button circular onClick={() => this.handleComplete(order.orderid)} style={{background: '#B7E4A9'}}>COMPLETE</Button>
            </Grid.Column>
            <Grid.Column width='2'verticalAlign='middle' textAlign='center'> 
              Student-Charge
              <h3 style={{margin:'0'}}>{'$' + order.cost.toFixed(2)}</h3>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle' textAlign='center'>
              <h2>PAID</h2>
            </Grid.Column>
          </Grid.Row>
        </React.Fragment>
      
      ) }
      else {
        return (
          <React.Fragment>
          <Grid.Row>
            <Grid.Column verticalAlign='middle' width='2' style={{textAlign:'center'}}>
              <h1>{order.orderid}</h1>
            </Grid.Column>
            <Grid.Column width='6'>
              {order.item.map(subitem => {
                return (
                  <React.Fragment>
                    <h2 style={{margin: '0'}}>{subitem}</h2>
                    <Divider />
                  </React.Fragment>
                )
              })}
              <h3 style={{margin: '0'}}>{order.netid}</h3>
              <p>{order.time}</p>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
              {/* disable in progress button after order is in progress*/}
              <Button circular disabled={order.status === 1} onClick={() => this.handleInProgress(order.orderid)} style={{background: '#F98F69'}}>IN PROGRESS</Button>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
              <Button circular onClick={() => this.handleComplete(order.orderid)} style={{background: '#B7E4A9'}}>COMPLETE</Button>
            </Grid.Column>
            <Grid.Column width='2'verticalAlign='middle' textAlign='center'> 
              Pay In-Store
              <h3 style={{margin:'0'}}>{'$' + order.cost.toFixed(2)}</h3>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle' textAlign='center'>
              <Button circular onClick={() => this.handlePaid(order.orderid)} color='red'>PAID</Button>
            </Grid.Column>
          </Grid.Row>
        </React.Fragment>
        )
      }
    });

    return (
      <React.Fragment>
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Grid stackable divided='vertically'>
          {/*  new row for every order*/}
          {pendingOrders}
        </Grid>
      </React.Fragment>
    );
  }
}

export default BaristaOrders;

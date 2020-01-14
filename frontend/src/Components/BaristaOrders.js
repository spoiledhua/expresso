import React from 'react';
import { Header, Segment, Sidebar, Grid, Button, Divider, Dimmer, Loader} from 'semantic-ui-react';

import BaristaHeader from './BaristaHeader';
import * as dingURL from '../Assets/ding.mp3';

import { getBaristaOrders, postInProgress, postComplete, postPaid } from '../Axios/axios_getter';

const ding = new Audio(dingURL);

class BaristaOrders extends React.Component {

  state = {
    allOrders: [],
    loading: false,
    transition: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    this.getPendingOrdersInterval(true);
    this.intervalId = setInterval(this.getPendingOrdersInterval, 10000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  toggleOn = () => {
    this.setState({ transition: true });
    this.timeout = setTimeout(() => {this.setState({ transition: false })}, 3000);
  }

  getPendingOrdersInterval = async (isFirstLoad) => {
     getBaristaOrders(JSON.parse(localStorage.getItem('token')))
      .then(allOrders => {
        // Check if there are any new orders
        let hasNewOrders = false;
        if (!isFirstLoad) {
          const oldOrders = new Set(this.state.allOrders.map(order => order.orderid));
          for (let i = 0; i < allOrders.length; i++) {
            if (!oldOrders.has(allOrders[i].orderid)) {
              hasNewOrders = true;
              break;
            }
          }
        }

        // If there's a new order, play a ding
        if (hasNewOrders) {
          ding.play();
        }
        this.setState({ allOrders: allOrders });
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({ loading: false });
  }

  handleInProgress = async (id) => {
    this.setState({ loading: true });
    await postInProgress(id, JSON.parse(localStorage.getItem('token')));
    await this.getPendingOrdersInterval();
    this.setState({ loading: false });
  }

  handleComplete = async (id) => {
    this.setState({ loading: true });
    await postComplete(id, JSON.parse(localStorage.getItem('token')));
    await this.getPendingOrdersInterval();
    this.toggleOn();
    this.setState({ loading: false });
  }

  handlePaid = async (id) => {
    this.setState({ loading: true });
    await postPaid(id, JSON.parse(localStorage.getItem('token')));
    await this.getPendingOrdersInterval();
    this.setState({ loading: false });
  }

  render() {

    const { allOrders } = this.state;

    let pendingOrders = (allOrders.length === 0) ?
    <Header as='h3'>
      No Orders!
    </Header> :

    this.state.allOrders.map(order => {
      return (
        <React.Fragment key={order.orderid}>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <h1>{order.orderid}</h1>
            </Grid.Column>
            <Grid.Column width='8'>
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
            <Grid.Column width='2'>
              <Button circular disabled={(order.order_status === 1) ? true : false} onClick={() => this.handleInProgress(order.orderid)} style={{fontFamily:'Avenir', background: '#EBD36D'}}>IN PROGRESS</Button>
            </Grid.Column>
            <Grid.Column width='2'>
              {order.status ? <Header as='h3'>PAID</Header> : <Button circular onClick={() => this.handlePaid(order.orderid)}  style={{color:'white', fontFamily:'Avenir', background:'#C96148'}}>UNPAID</Button>}
            </Grid.Column>
            <Grid.Column width='2'>
              <Button circular disabled={!order.status} onClick={() => this.handleComplete(order.orderid)} style={{color: 'white', fontFamily:'Avenir', background: '#85A290'}}>COMPLETE</Button>
            </Grid.Column>
          </Grid.Row>
        </React.Fragment>
      )
    });

    return (
      <React.Fragment>
        <Sidebar as={Header} direction='top' width='very wide' visible={this.state.transition} animation='overlay' style={{ 'zIndex': '1' }}>
          <div style={{ height: '5vh' }} />
          <Segment raised textAlign='center' style={{color: 'white', fontFamily:'Avenir', background: '#EDAC86'}}>
            Order completed!
          </Segment>
        </Sidebar>
        <BaristaHeader history={this.props.history} />
        <div style={{ height: '12vh' }} />
        <Dimmer active={this.state.loading} inverted page>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Grid stackable divided='vertically' textAlign='center'>
          <Grid.Row>
            <Grid.Column>
              <h1 style={{ fontFamily:'Didot', fontStyle:'italic' }}>Orders</h1>
            </Grid.Column>
          </Grid.Row>
          {/*  new row for every order*/}
          {pendingOrders}
        </Grid>
      </React.Fragment>
    );
  }
}

export default BaristaOrders;

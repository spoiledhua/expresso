import React from 'react';
import { Header, Grid, Button, Divider, Dimmer, Loader} from 'semantic-ui-react';

import BaristaHeader from './BaristaHeader';
import { getBaristaOrders, postInProgress, postComplete, postPaid } from '../Axios/axios_getter';

class BaristaOrders extends React.Component {

  state = {
    allOrders: [],
    loading: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    setTimeout(this.getPendingOrders, 1000);
    setInterval(this.getPendingOrders, 10000);
  }

  getPendingOrders = async () => {
    await getBaristaOrders()
      .then(allOrders => {
        this.setState({ allOrders: allOrders });
      })
      .catch(error => {
        console.log(error);
        this.setState({ allOrders: [] });
      });
    this.setState({ loading: false });
  }

  handleInProgress = async (id) => {
    this.setState({ loading: true });
    await postInProgress(id);
    setTimeout(this.getPendingOrders, 1000);
    this.setState({ loading: false });
  }

  handleComplete = async (id) => {
    this.setState({ loading: true });
    await postComplete(id);
    setTimeout(this.getPendingOrders, 1000);
    this.setState({ loading: false });
  }

  handlePaid = async (id) => {
    this.setState({ loading: true });
    await postPaid(id);
    setTimeout(this.getPendingOrders, 1000);
    this.setState({ loading: false });
  }

  render() {

    const { allOrders } = this.state;

    let pendingOrders = (allOrders.length === 0) ?
    <Header as='h3'>
      :)
    </Header> :

    this.state.allOrders.map(order => {
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
            <Grid.Column width='3' verticalAlign='middle'>
              <Button circular disabled={order.order_status} onClick={() => this.handleInProgress(order.orderid)}
                style={{fontFamily:'Avenir', background: '#EBD36D'}}>IN PROGRESS</Button>
            </Grid.Column>
            <Grid.Column width='3' verticalAlign='middle'>
              <Button circular disabled={!order.status} onClick={() => this.handleComplete(order.orderid)}
                style={{fontFamily:'Avenir', background: '#85A290'}}>COMPLETE</Button>
            </Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
              {order.status ? <Header as='h3'
                style={{fontFamily:'Avenir'}}>
                PAID</Header> : <Button circular onClick={() => this.handlePaid(order.orderid)}
                style={{color:'white', fontFamily:'Avenir', background:'#C96148'}}>PENDING</Button>}
            </Grid.Column>
          </Grid.Row>
        </React.Fragment>
      )
    });

    return (
      <React.Fragment>
        <BaristaHeader history={this.props.history} />
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

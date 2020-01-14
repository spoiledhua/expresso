import React from 'react';
import { Header, Grid, Dimmer, Loader, Divider } from 'semantic-ui-react';

import ClientHeader from './ClientHeader';

import { getHistory } from '../Axios/axios_getter'

class CustomerHistory extends React.Component {

  state = {
    history: [],
    shoppingCart: [],
    loading: false,
    user: null
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    setTimeout(this.getHistory, 1000);
    this.intervalId = setInterval(this.getHistory, 10000);
    if (JSON.parse(localStorage.getItem('shoppingCart')) !== null) {
      this.setState({ shoppingCart: JSON.parse(localStorage.getItem('shoppingCart'))});
    }
    if (JSON.parse(localStorage.getItem('user')) !== null) {
      this.setState({ user: JSON.parse(localStorage.getItem('user'))});
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  getHistory = async () => {
    await getHistory(this.state.user, JSON.parse(localStorage.getItem('token')))
      .then(history => {
        this.setState({ history: history });
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({ loading: false });
  }

  render() {

    const { history } = this.state;

    let showHistory = (history.length === 0) ?
    <Header as='h3'>
      No Orders!
    </Header> :

    <React.Fragment>
      {history.map(history => {
        let paymentType = (history.payment) ? "Student Charge" : "In-Store";
        return (
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width='2'></Grid.Column>
            <Grid.Column width='2'>
              <p>{history.time}</p>
            </Grid.Column>
            <Grid.Column width='8'>
              {history.item.map(subitem => {
                return (
                  <React.Fragment>
                    <h2 style={{margin: '0'}}>{subitem}</h2>
                    <Divider />
                  </React.Fragment>
                )
              })}
            </Grid.Column>
            <Grid.Column width='1'>
              <h3>{'$' + history.cost.toFixed(2)}</h3>
            </Grid.Column>
            <Grid.Column width='2'>
              <p>{paymentType}</p>
            </Grid.Column>
            <Grid.Column width='1'></Grid.Column>
          </Grid.Row>
        )
      })}
    </React.Fragment>

      return (
          <React.Fragment>
            <ClientHeader history={this.props.history} shoppingCart={this.state.shoppingCart}/>
            <div style={{ height: '12vh' }} />
            <Dimmer active={this.state.loading} inverted page>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Grid stackable divided='vertically' textAlign='center'>
              <Grid.Row>
                <Grid.Column>
                  <h1 style={{ fontFamily:'Didot', fontStyle:'italic' }}>Account History</h1>
                </Grid.Column>
              </Grid.Row>
              {showHistory}
            </Grid>
          </React.Fragment>

        );
    }
}

export default CustomerHistory;

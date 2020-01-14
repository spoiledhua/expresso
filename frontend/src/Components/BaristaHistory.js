import React from 'react';
import { Header, Grid, Divider, Dimmer, Loader } from 'semantic-ui-react';

import BaristaHeader from './BaristaHeader';
import { getDayHistory } from '../Axios/axios_getter';

class BaristaHistory extends React.Component {

  state = {
    dayHistory: [],
    allHistory: [],
    showAll: false,
    loading: false,
    intervalId: null
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    setTimeout(this.getDayHistory, 1000);
    let intervalId = setInterval(this.getDayHistory, 10000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  }

  getDayHistory = async () => {
    await getDayHistory(JSON.parse(localStorage.getItem('token')))
      .then(dayHistory => {
        this.setState({ dayHistory: dayHistory });
      })
      .catch(error => {
        console.log(error);
        this.setState({ dayHistory: [] });
      });
    this.setState({ loading: false });
  }

    render() {

      const { dayHistory, allHistory, showAll } = this.state;

      let historyType = (showAll) ? allHistory : dayHistory;

      let history = (historyType.length === 0) ?
      <Header as='h3'>
        No Orders!
      </Header> :

      <React.Fragment>
        {historyType.map(history => {
          let paymentType = (history.payment) ? "Student Charge" : "In-Store";
          return (
            <Grid.Row verticalAlign='middle'>
              <Grid.Column width='2' verticalAlign='middle' style={{textAlign:'center'}}>
                <p>{history.time}</p>
              </Grid.Column>
              <Grid.Column width='8' verticalAlign='middle'>
                {history.item.map(subitem => {
                  return (
                    <React.Fragment>
                      <h2 style={{margin: '0'}}>{subitem}</h2>
                      <Divider />
                    </React.Fragment>
                  )
                })}
              </Grid.Column>
              <Grid.Column width='2'>
                <h3>{'$' + history.cost.toFixed(2)}</h3>
              </Grid.Column>
              <Grid.Column width='2'>
                <h3>{history.netid}</h3>
              </Grid.Column>
              <Grid.Column width='2'>
                <p>{paymentType}</p>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </React.Fragment>


        return (
            <React.Fragment>
              <BaristaHeader history={this.props.history} />
              <div style={{ height: '12vh' }} />
              <Dimmer active={this.state.loading} inverted page>
                <Loader inverted>Loading</Loader>
              </Dimmer>
              <Grid stackable divided='vertically' textAlign='center'>
                <Grid.Row>
                  <Grid.Column>
                    <h1 style={{ fontFamily:'Didot', fontStyle:'italic' }}>Order History</h1>
                  </Grid.Column>
                </Grid.Row>
                {history}
              </Grid>
            </React.Fragment>
        );
    }
}

export default BaristaHistory

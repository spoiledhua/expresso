import React from 'react';
import { Header, Grid, Dimmer, Loader, Divider } from 'semantic-ui-react';
import * as history from '../Assets/Orders.png';
import { getHistory } from '../Axios/axios_getter'

class CustomerHistory extends React.Component {

  state = {
    history: [],
    loading: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    this.getHistory();
    setInterval(this.getHistory, 10000);
    this.setState({ loading: false });
  }

  getHistory = async () => {
    await getHistory(this.props.netid)
      .then(history => {
        this.setState({ history: history });
      })
      .catch(error => {
        console.log(error);
        this.setState({ history: [] });
      });
  }

  render() {

    const { history } = this.state;

    let showHistory = (history.length === 0) ?
    <Header as='h3'>
      :)
    </Header> :

    <React.Fragment>
      {history.map(history => {
        let paymentType = (history.payment) ? "Student Charge" : "In-Store";
        console.log(history)
        return (
          <Grid.Row>
            <Grid.Column width='2'></Grid.Column>
            <Grid.Column width='2' verticalAlign='middle'>
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
            <Grid.Column width='2' verticalAlign='middle'>
              <h3>{'$' + history.cost.toFixed(2)}</h3>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' width='2'>
              <p>{paymentType}</p>
            </Grid.Column>
          </Grid.Row>
        )
      })}
    </React.Fragment>

      return (
          <React.Fragment>
            <Dimmer active={this.state.loading} inverted page>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Grid stackable divided='vertically'>
              <Grid.Row>
                <Grid.Column width='2' />
                <Grid.Column width='14' >
                  <h1 style={{fontFamily:'Didot', fontStyle:'italic'}}>Past Orders</h1>
                </Grid.Column>
              </Grid.Row>
              {showHistory}
            </Grid>
          </React.Fragment>

        );
    }
}

export default CustomerHistory

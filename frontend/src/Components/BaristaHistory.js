import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Button, Divider, Dimmer, Loader } from 'semantic-ui-react';

import { getDayHistory, getAllHistory } from '../Axios/axios_getter';

class BaristaHistory extends React.Component {

  state = {
    dayHistory: [],
    allHistory: [],
    showAll: false,
    loading: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    this.getDayHistory();
    this.getAllHistory();
    this.setState({ loading: false });
    let intervalFunctionDay = setInterval(this.getDayHistory, 10000);
    let intervalFunctionAll = setInterval(this.getAllHistory, 10000);
  }

  getDayHistory = async () => {
    await getDayHistory()
      .then(dayHistory => {
        this.setState({ dayHistory: dayHistory });
      })
      .catch(error => {
        console.log(error);
        this.setState({ dayHistory: [] });
      });
  }

  getAllHistory = async () => {
    await getAllHistory()
      .then(allHistory => {
        this.setState({ allHistory: allHistory });
      })
      .catch(error => {
        console.log(error);
        this.setState({ allHistory: [] });
      });
  }

    render() {

      const { dayHistory, allHistory, showAll } = this.state;

      let historyType = (showAll) ? allHistory : dayHistory;

      let history = (historyType.length == 0) ?
      <Header as='h3'>
        :)
      </Header> :

      <React.Fragment>
        {historyType.map(history => {
          let paymentType = (history.payment) ? "Student Charge" : "In-Store";
          return (
            <Grid.Row>
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
              <Grid.Column width='2' verticalAlign='middle'>
                <h3>{'$' + history.cost.toFixed(2)}</h3>
              </Grid.Column>
              <Grid.Column verticalAlign='middle' width='2'>
                <h3>{history.netid}</h3>
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
                {history}
              </Grid>
            </React.Fragment>

        );
    }
}

export default BaristaHistory

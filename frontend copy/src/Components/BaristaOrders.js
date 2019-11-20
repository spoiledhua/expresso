import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Button, Divider} from 'semantic-ui-react';

import { getBaristaOrders, postInProgress, postComplete } from '../Axios/axios_getter';

class BaristaOrders extends React.Component {

  state = {
    allOrders: [],
    loading: false
  }

  componentDidMount = () => {
    this.setState({ loading: true });

    getBaristaOrders()
      .then(allOrders => {
        this.setState({ allOrders: allOrders });
        console.log(this.state.allOrders);
      })

    this.setState({ loading: false });
  }

  handleInProgress = (id) => {
    this.setState({ loading: true });
    postInProgress(id);
    this.setState({ loading: false });
  }

  handleComplete = (id) => {
    this.setState({ loading: true });
    postComplete(id);
    this.setState({ loading: false });
  }

  render() {

    return (
      <React.Fragment>
        <Grid divided='vertically'>
          {/*  new row for every order*/}
          <Grid.Row>
            <Grid.Column verticalAlign='middle' width='2' style={{textAlign:'center'}}>
              <h1>1</h1>
            </Grid.Column>
            <Grid.Column width='6'>
              <h2 style={{margin: '0'}}>Latte (Large, Oat Milk, Vanilla)</h2>
              <h3 style={{margin: '0'}}>Dora Zhao</h3>
              <p>8:05:32</p>
            </Grid.Column>
            <Grid.Column width='4' verticalAlign='middle'>
              <Button circular onClick={this.handleInProgress} style={{background: '#F98F69'}}>IN PROGRESS</Button>
              <Button circular onClick={this.handleComplete} style={{background: '#B7E4A9'}}>COMPLETE</Button>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' >
              <h3 style={{margin:'0', textAlign:'center'}}>$2.70</h3>
              <Button circular color='red'>PAID</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
      </React.Fragment>
    );
  }
}

export default BaristaOrders;


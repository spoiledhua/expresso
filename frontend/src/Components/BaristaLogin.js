import React from 'react';
import { Card, Icon, Image, Container, Header, Grid, Button, Radio, Segment, Message, Checkbox, Form, Item, Statistic } from 'semantic-ui-react';
import { baristaLogin } from '../Axios/axios_getter';
import * as logo from '../Assets/logo.png';

class BaristaLogin extends React.Component {

  state = {
    username: '',
    password: '',
    loading: false
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handleLogin = () => {
    this.setState({ loading: true });
    const user = { username: this.state.username, password: this.state.password };
    baristaLogin(user)
      .then(data => {
        this.props.history.push('barista');
      })
      .catch(error => {
        console.log('invalid login');
      });
    this.setState({ loading: false });
  }

  render() {

    const { selectedItem } = this.state

    var appMenus = {'Menu':
    <Header as='h2'>
      <Icon name='settings' />
      <Header.Content>
        Account Settings
        <Header.Subheader>Manage your preferences</Header.Subheader>
      </Header.Content>
    </Header>,
    'Order': <div>My Order</div>,
    'User': <div>User</div>};

    return (
      <React.Fragment>
        {/* Main Content */}
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='#F98F69' textAlign='center'>
                  Barista Login
                </Header>
                <Form size='large'>
                  <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' value={this.state.username} onChange={this.handleUsername}/>
                    <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' value={this.state.password} onChange={this.handlePassword} type='password' />
                    <Button onClick = {this.handleLogin} color='black' style={{background: '#F98F69'}} fluid size='medium'>
                      Login
                    </Button>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid>
      </React.Fragment>

    );
  }
}

export default BaristaLogin;

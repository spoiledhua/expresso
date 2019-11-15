import React from 'react';
import { Card, Icon, Image, Container, Header, Grid, Button, Radio, Form, Divider } from 'semantic-ui-react';

// props: list of selected items as
// {[Item: mainItem, Add-ons: [addItem1, addItem2], ...]}
// Each Item object has Item.price field
class OrderPage extends React.Component {

  state = {
    payment: null
  }

  totalCost = () => {
    // calculate total cost
    return '$5.00';
  }

  selectPayment = (e, { label }) => {
    this.setState({ payment: label});
  }

  handlePlaceOrder = (e) => {
    // send order to database and barista interface
  }

  render() {

    return (
      <Container style={{ width: '720px' }}>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h2' color='black' style={{fontFamily:'Didot'}}>1. ORDER</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                {/*for each item in list*/}
                <Grid.Column width='3'>
                  <Header as='h3' color='grey'>{/*mainItem*/}Latte</Header>
                </Grid.Column>
                <Grid.Column width='3' />
                <Grid.Column>
                  <Header as='h3' color='grey'>{/*price*/}$3.50</Header>
                </Grid.Column>
                <Grid.Column width='2'></Grid.Column>
                <Grid.Column width='2' verticalAlign='bottom'>
                  <Button circular basic color='red'>DELETE</Button>
                </Grid.Column>
              </Grid.Row>
              {/* for each addon per item*/}
              <Grid.Row>
                <Grid.Column width='3'>
                  <span>{/*addon*/}Vanilla Syrup</span>
                </Grid.Column>
                <Grid.Column width='3' />
                <Grid.Column>
                  <Header as='h3' color='grey'>{/*price*/}$0.50</Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider />
            <Grid>
              <Grid.Row>
                <Grid.Column width='3'>
                  <Header as='h3' color='black'>Total</Header>
                </Grid.Column>
                <Grid.Column width='3' />
                <Grid.Column>
                  <Header as='h3' color='black'>{this.totalCost()}</Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h2' color='black' style={{fontFamily:'Didot'}}>2. PAYMENT</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    <Form.Field>
                      <Radio
                        label='Student Charge'
                        name='payment'
                        checked={this.state.payment === 'Student Charge'}
                        onChange={this.selectPayment}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='Pay at Store'
                        name='payment'
                        checked={this.state.payment === 'Pay at Store'}
                        onChange={this.selectPayment}
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <div>
            <Button circular floated='right' basic color='black'>
              PLACE ORDER
            </Button>
          </div>
        </Card>
      </Container>
    );
  }
}

export default OrderPage;

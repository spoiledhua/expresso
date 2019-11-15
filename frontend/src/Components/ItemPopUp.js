import React from 'react';
import { Card, Icon, Image, Container, Header, Grid, Button, Radio, Checkbox, Form, Item, Statistic } from 'semantic-ui-react';

import * as cappuccino from '../Assets/cappuccino.jpeg';

// props: name, handleClose (from menupage)
class ItemPopUp extends React.Component {

  state = {
    size: null,
  }

  selectSize = (e, { label }) => {
    this.setState({ size: label});
  }

  render() {

    return (
      <Container style={{ width: '720px' }}>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row textAlign='right'>
                <Grid.Column>
                  <Button circular basic color='black' icon='close' size='medium' floated='right' onClick={this.props.handleClose}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width='3'>
                </Grid.Column>
                <Grid.Column width='10'>
                  <Item.Group>
                    <Item>
                      <Item.Image src={cappuccino} />
                      <Item.Content verticalAlign='middle'>
                        <Item.Header as='a' onClick={this.props.handleClick}>Cappuccino</Item.Header>
                        <Item.Meta>Imported from Italy.</Item.Meta>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Grid.Column>
                <Grid.Column width='3'>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width='4'>
                </Grid.Column>
                <Grid.Column width='8' textAlign='left'>
                  <Header as='h3' style={{fontFamily:'Didot'}}>SIZE</Header>
                  <Form>
                    <Form.Field>
                      <Radio
                        label='Small'
                        name='size'
                        checked={this.state.size === 'Small'}
                        onChange={this.selectSize}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='Large'
                        name='size'
                        checked={this.state.size === 'Large'}
                        onChange={this.selectSize}
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column width='4'>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width='4'>
                </Grid.Column>
                <Grid.Column width='8' textAlign='left'>
                  <Header as='h3' style={{fontFamily:'Didot'}}>ADD-ONS</Header>
                  <Form>
                    <Form.Field>
                      <Checkbox
                        label='Vanilla'
                        value='Vanilla'
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        label='Caramel'
                        value='Caramel'
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column width='4'>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content>
            <Grid padded>
              <Grid.Row>
                <Grid.Column width='4'>
                </Grid.Column>
                <Grid.Column width='4' textAlign='left' verticalAlign='middle'>
                  <Header as='h3' color='grey'>$5.00</Header>
                </Grid.Column>
                <Grid.Column width='4' textAlign='center' verticalAlign='middle'>
                  <Button circular basic color='black'>
                    ADD ITEM
                  </Button>
                </Grid.Column>
                <Grid.Column width='4'>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Container>
    );
  }
}

export default ItemPopUp;

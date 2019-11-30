import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form } from 'semantic-ui-react'

class AddItem extends React.Component {
    render() {

        return (
            <React.Fragment>
                <Card fluid>
                    <Card.Content>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column width='14'>
                                    <h2>Add Item</h2>
                                </Grid.Column>
                                <Grid.Column width='2'>
                                    <Button circular icon='close' size='medium' floated='right' onClick={this.props.handleAddClose}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width='2'/>
                                <Grid.Column width='12'>
                                <Form style={{textAlign:'left'}}>
                                    <Form.Field>
                                        <label>Item Name</label>
                                        <input placeholder='Item Name' />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Price</label>
                                        <input placeholder='$0.00' />
                                    </Form.Field>
                                    <label>Category</label>
                                    <Form.Select placeholder='Category' options={[{ text: 'Drink'}, { text: 'Food'}, {text: 'Add-On'}]}>
                                    </Form.Select>
                                </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content>
                        <button type="submit" class="ui button">Add Item</button>
                    </Card.Content>
                </Card>
            </React.Fragment>
        )
    }
}

export default AddItem;

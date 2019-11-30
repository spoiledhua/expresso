import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Label } from 'semantic-ui-react'

class EditItem extends React.Component {
    
    render() {

        return (
            <React.Fragment>
                <Card fluid>
                    <Card.Content>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column width='14'>
                                    <h2>Edit Item</h2>
                                </Grid.Column>
                                <Grid.Column width='2'>
                                    <Button circular icon='close' size='medium' floated='right' onClick={this.props.handleEditClose}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Form>
                                    <Label>Item Name</Label>
                                    <Form.Input defaultValue={this.props.name}/>
                                    <Label>Price</Label>
                                    <Form.Input defaultValue='hi'/>
                                    <Form.Select options={[{ text: 'Drink'}, { text: 'Food'}, {text: 'Add-On'}]}>
                                    </Form.Select>
                                </Form>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content>
                        <button type="submit" class="ui button">Update</button>
                    </Card.Content>
                </Card>
            </React.Fragment>
        )
    }
}

export default EditItem;

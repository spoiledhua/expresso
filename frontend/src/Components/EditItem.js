import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Label } from 'semantic-ui-react'

class EditItem extends React.Component {
    // lolz this needs a ton of work
    
    render() {

        return (
            <React.Fragment>
                <Card fluid>
                    <Card.Content>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column width='14'/>
                                <Grid.Column width='2'>
                    
                                    <Button circular icon='close' size='medium' floated='right' onClick={this.props.handleEditClose}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width='2'/>
                                <Grid.Column width='12'>
                                <Form style={{textAlign:'left'}}>
                                    {/* should prepopulate with current prices*/}
                                    <Form.Field>
                                        <label>Item Name</label>
                                        <input placeholder='hi' />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Price</label>
                                        <input placeholder='hi'/>
                                    </Form.Field>
                                    <label>Category</label>
                                    <Form.Select placeholder='Category' options={[{key:1, text: 'Drink'}, {key:2, text: 'Food'}, {key:3,text: 'Add-On'}]}>
                                    </Form.Select>
                                </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content>
                        <Button circular basic color='green'>Add Item</Button>
                        <Button circular basic color='red'>Cancel</Button>
                        
                    </Card.Content>
                </Card>
            </React.Fragment>
        )
    }
}

export default EditItem;

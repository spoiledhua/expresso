import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Label } from 'semantic-ui-react'

class EditItem extends React.Component {
    
    // lolz this needs a ton of work
    
    render() {
        const item = this.props.item

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
                                        <label>Name</label>
                                        <input placeholder={item.name} />
                                    </Form.Field>
                                    {(item.category == 'Drink' | item.category == 'Food' ) ?
                                        <Form.Field>
                                            <label>Description</label>
                                            <input placeholder={item.description} />
                                        </Form.Field>
                                    : null}
                                    {(item.category == 'Drink') ?
                                        <Form.Field>
                                            <label>Small Price</label>
                                            <input/>
                                        </Form.Field>
                                    : null}
                                    {(item.category == 'Drink') ?
                                        <Form.Field>
                                            <label>Large Price</label>
                                            <input/>
                                        </Form.Field>
                                    : null}
                                    {(item.category == 'Food' | !item.category) ?
                                        <Form.Field>
                                            <label>Price</label>
                                            <input/>
                                        </Form.Field>
                                    : null}
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

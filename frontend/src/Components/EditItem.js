import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Label } from 'semantic-ui-react'

class EditItem extends React.Component {
    // this breaks on espresso cuz one size -_-
    
    render() {
        const item = this.props.item
        console.log(item)
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
                                        <input defaultValue={item.name} />
                                    </Form.Field>
                                    {(item.category == 'Drink' | item.category == 'Food' ) ?
                                        <Form.Field>
                                            <label>Description</label>
                                            <input defaultValue={item.description} />
                                        </Form.Field>
                                    : null}
                                    {/* BREAKS ON ESPRESSO */}
                                    {(item.category == 'Drink') ?
                                        <Form.Field>
                                            <label>Small Price</label>
                                            <input 
                                                defaultValue={item.sp[0][0] == 'Small' ? item.sp[0][1] : null}
                                            />
                                        </Form.Field>
                                    : null}
                                    {(item.category == 'Drink') ?
                                        <Form.Field>
                                            <label>Large Price</label>
                                            <input
                                                defaultValue={item.sp[1][0] == 'Large' ? item.sp[1][1] : null}
                                            />
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
                        <Button circular basic color='green'>Update</Button>
                        <Button circular basic color='gray'>Cancel</Button>
                        <Button circular basic color='red' floated='right'>Remove</Button>
                    </Card.Content>
                </Card>
            </React.Fragment>
        )
    }
}

export default EditItem;

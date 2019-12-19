import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Checkbox } from 'semantic-ui-react'

class ClientSettings extends React.Component {
    render() {
        
        return (
            <React.Fragment>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Grid>

                        <Grid.Column width='2' />
                        <Grid.Column width='6'>
                            <Header as='h2'>Settings</Header>
                            <Form>
                                <Form.Field>
                                    <label>Name On Order</label>
                                    <input placeholder='Nickname' />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox label='Subscribe to email updates on order status' />
                                </Form.Field>
                                <Button circular basic color='black'>SAVE</Button>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Grid>
                        <Grid.Column width='2' />
                        <Grid.Column width='12'>
                            <Form>
                                <Form.Field>
                                    <label>Name On Order</label>
                                    <input placeholder='Nickname' />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox label='Subscribe to email updates on order status' />
                                </Form.Field>
                                <Button basic color='black'>SAVE</Button>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Responsive>
            </React.Fragment>
        )
    }
}

export default ClientSettings;

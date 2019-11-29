import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card } from 'semantic-ui-react'


const InProgress = () => {
    return (
    <Card centered raised>
        <Card.Content textAlign='center'>
            <br />
            <h3>In Progress ✅</h3>
            <br /><br />
        </Card.Content>
    </Card>
    )
}

const Complete = () => {
    return (
    <Card centered raised>
        <Card.Content textAlign='center'>
            <br />
            <h3>Complete ✅</h3>
            <br /><br />
        </Card.Content>
    </Card>
    )
}

class OrderResponsiveness extends React.Component {
    render() {

        return (
            <React.Fragment>
                <Complete/>
            </React.Fragment>

        )
    }


}

export default OrderResponsiveness;

import React from 'react';
import { Button, Sidebar, Segment, Menu, Icon, Image, Container, Header, Grid } from 'semantic-ui-react';

class Test extends React.Component {

  render() {
    return (
      <React.Fragment>
        <Menu fixed="top">
          <Button className="item" onClick={this.toggleVisible}>
            <i className="sidebar icon" />
          </Button>
          <Menu.Item name="home">
            <Icon name="home" />Menu item
          </Menu.Item>
        </Menu>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            visible
            as={Menu}
            animation="push"
            width="thin"
            icon="labeled"
            vertical
            inverted
          >
            <Menu.Item name="home">
              <Icon name="home" />Sidebar menu item
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>Whatever content</Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    );
  }
}

export default Test;

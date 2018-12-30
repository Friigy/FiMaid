import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { BrowserRouter, Link } from "react-router-dom";

class NavBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {
            activeItem: 'home'
        };
    }
  
    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        return (
            <div className="NavBar">
                <Menu pointing secondary>
                    <Menu.Item name='home' active={this.state.activeItem === 'home'} onClick={this.handleItemClick}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item name='scan folder' active={this.state.activeItem === 'scan folder'} onClick={this.handleItemClick}>
                        <Link to="/scan">Scan folders</Link>
                    </Menu.Item>
                    <Menu.Item name='tag folders' active={this.state.activeItem === 'tag folders'} onClick={this.handleItemClick}>
                        <Link to="/tag">Tag fodlers</Link>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item name='settings' active={this.state.activeItem === 'settings'} onClick={this.handleItemClick}>
                            <Link to="/settings">Settings</Link>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default NavBar;

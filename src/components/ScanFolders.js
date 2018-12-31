import React, { Component } from 'react';
import { Grid, Button, Input, Menu } from 'semantic-ui-react';

class ScanFolders extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.pathScan = this.pathScan.bind(this);

        this.state = {
            pathToNewFolder: "",
            managedFolders: [],
            activeItem: "",
        };
    }
    
    handleChange(e) {
        this.setState({ pathToNewFolder: e.target.value });
    }
    
    handleItemClick(e) {
        this.setState({ pathToNewFolder: e.target.value });
    }
    
    pathScan() {
        const fs = window.require('fs');
        var content;

        fs.readFile(this.state.pathToNewFolder, (err) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                throw err;
            }
        });

        fs.readFileSync(this.state.pathToNewFolder + "/.fimaid/MAID", 'utf-8', (err, data) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                throw err;
            }
            if (data) {
                content = data;
            }
        });
        console.log(content);
    }

    render() {
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Menu pointing secondary vertical>
                        <Input type='text' placeholder='Your path here' onChange={this.handleChange} />
                        <Button type='submit' onClick={this.pathScan}>Scan</Button>

                        {this.state.managedFolders.forEach(folder => {
                            return <Menu.Item name={folder} active={this.state.activeItem === folder} onClick={this.handleItemClick} />;
                        })}

                        <Menu.Item name='home' active={this.state.activeItem === 'home'} onClick={this.handleItemClick} />
                        <Menu.Item
                        name='messages'
                        active={this.state.activeItem === 'messages'}
                        onClick={this.handleItemClick}
                        />
                        <Menu.Item
                        name='friends'
                        active={this.state.activeItem === 'friends'}
                        onClick={this.handleItemClick}
                        />
                    </Menu>
                </Grid.Column>
            </Grid>
        );
    }
}

export default ScanFolders;
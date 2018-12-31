import React, { Component } from 'react';
import { Grid, Button, Input, Menu } from 'semantic-ui-react';

class ScanFolders extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.pathScan = this.pathScan.bind(this);
        this.test = this.test.bind(this);

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
    
    test() {
        console.log(this.state.managedFolders.toString());
    }
    
    pathScan() {
        const fs = window.require('fs');
        var content = "";
        var folderExists = false;
        var updatedManagedFolders = this.state.managedFolders;
        /*
        fs.readFile(this.state.pathToNewFolder, (err) => {
        if (err) {
        console.log("ERROR");
        console.log(err);
        throw err;
        }
        });
        */
        try {
            content = fs.readFileSync(this.state.pathToNewFolder + "/.fimaid/MAID", 'utf-8');
            console.log("CONTENT");
            console.log(content);
            folderExists = true;
        } catch (err) {
            console.log("ERROR");
            console.log(err);
        }

        if (folderExists) {
            updatedManagedFolders.push(content);
            this.setState({ managedFolders: updatedManagedFolders });
        }
        console.log(this.state.managedFolders);
    }

    render() {
        return (
            <div>
                <Menu pointing secondary vertical>
                    <Input type='text' placeholder='Your path here' onChange={this.handleChange} />
                    <Button type='submit' onClick={this.pathScan}>+</Button>

                    {
                        this.state.managedFolders.map(folder => {
                            console.log(folder);
                            console.log(folder.replace('/', '\\/'));
                            return (
                                <Menu.Item name={folder} active={this.state.activeItem === folder} onClick={this.handleItemClick}>
                                    {folder.replace('/', '\/')}
                                </Menu.Item>
                            );
                        })
                    }
                </Menu>
                
                <Grid>
                    <Button type='submit' onClick={this.test}>TEST</Button>
                </Grid>
            </div>
        );
    }
}

export default ScanFolders;
import React, { Component } from 'react';
import { Grid, Button, Input, Menu } from 'semantic-ui-react';

class Maid extends Component {
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
        var folderExists = true;
        var updatedManagedFolders = this.state.managedFolders;
        
        try {
            content = fs.readFileSync(this.state.pathToNewFolder + "/.fimaid", 'utf-8');
        } catch (err) {
            folderExists = false;
        }

        if (folderExists) {
            updatedManagedFolders.push(content);
            this.setState({ managedFolders: updatedManagedFolders });
        } else {
            try {
                fs.writeFileSync(this.state.pathToNewFolder + "/.fimaid", this.state.pathToNewFolder, 'utf-8');
            } catch (err) {
                console.log("ERREUR");
                console.log(err);
            }
            content = fs.readFileSync(this.state.pathToNewFolder + "/.fimaid", 'utf-8');
            updatedManagedFolders.push(content);
            this.setState({ managedFolders: updatedManagedFolders });
        }
        // json with nested folder (Json within folderList for folder and etc)
        // take the json, generate it in the application (relation tree) and work from this
    }

    render() {
        return (
            <div>
                <Menu pointing secondary vertical>
                    <Input type='text' placeholder='Your path here' onChange={this.handleChange} />
                    <Button type='submit' onClick={this.pathScan}>+</Button>

                    {
                        this.state.managedFolders.map(folder => {
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

export default Maid;
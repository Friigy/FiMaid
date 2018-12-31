import React, { Component } from 'react';
import { Grid, Button, Input, Menu } from 'semantic-ui-react';

class Maid extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.pathScan = this.pathScan.bind(this);
        this.folderScan = this.folderScan.bind(this);

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
        var content = "";
        var folderExists = true;
        var updatedManagedFolders = this.state.managedFolders;
        var folder = {
            "name": "",
            "folderList": [],
            "fileList": []
        }
        
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
                console.log("ERROR");
                console.log(err);
            }
            content = fs.readFileSync(this.state.pathToNewFolder + "/.fimaid", 'utf-8');
            updatedManagedFolders.push(content);
            this.setState({ managedFolders: updatedManagedFolders });
        }
        // json with nested folder (Json within folderList for folder and etc)
        // take the json, generate it in the application (relation tree) and work from this

        folder.name = this.state.pathToNewFolder;
        var readDir = fs.readdirSync(this.state.pathToNewFolder);

        readDir.map(entry => {
            console.log(entry);
            try {
                var lul = fs.readdirSync(this.state.pathToNewFolder + "/" + entry);
                folder.folderList.push(this.folderScan(this.state.pathToNewFolder + "/" + entry));
            } catch (err) {
                // NOT A DIRECTORY
                folder.fileList.push(entry);
            }
        });

        console.log(folder);
        try {
            fs.writeFileSync(this.state.pathToNewFolder + "/.library.json", JSON.stringify(folder), 'utf-8');
        } catch (err) {
            console.log("ERROR");
            console.log(err);
        }
    }

    folderScan(path) {
        const fs = window.require('fs');
        var folder = {
            "name": "",
            "folderList": [],
            "fileList": []
        }

        folder.name = path;
        var readDir = fs.readdirSync(path);

        readDir.map(entry => {
            console.log(entry);
            try {
                var lul = fs.readdirSync(path + "/" + entry);
                folder.folderList.push(this.folderScan(path + "/" + entry));
            } catch (err) {
                // NOT A DIRECTORY
                folder.fileList.push(entry);
            }
        });

        return folder;
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
            </div>
        );
    }
}

export default Maid;
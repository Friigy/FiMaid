import React, { Component } from 'react';
import { Button, Input, Menu } from 'semantic-ui-react';

class Maid extends Component {
    constructor(props, context) {
        super(props, context);

        const fs = window.require('fs');

        this.handleChange = this.handleChange.bind(this);
        this.pathScan = this.pathScan.bind(this);
        this.folderScan = this.folderScan.bind(this);

        this.state = {
            pathToNewFolder: "",
            managedFolders: [],
            activeItem: "",
        };

        var updatedManagedFolders = this.state.managedFolders;
        
        try {
            var content = fs.readFileSync("/home/friij/PersonalProject/fileManager/fimaid/PROFILE", 'utf-8');
            var lines = content.split('\n');
            lines.map(line => {
                updatedManagedFolders.push(line);
                this.setState({ managedFolders: updatedManagedFolders });
            });
        } catch (err) {
            console.log("PROFILE doesn't exist.");
            console.log(err);
        }
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

        try {
            fs.appendFileSync("/home/friij/PersonalProject/fileManager/fimaid/PROFILE", this.state.pathToNewFolder, 'utf-8');
        } catch (err) {
            console.log("ERROR");
            console.log(err);
        }

        folder.name = this.state.pathToNewFolder;
        var readDir = fs.readdirSync(this.state.pathToNewFolder);

        readDir.map(entry => {
            try {
                folder.folderList.push(this.folderScan(this.state.pathToNewFolder + "/" + entry));
            } catch (err) {
                folder.fileList.push(entry);
            }
        });

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
                folder.folderList.push(this.folderScan(path + "/" + entry));
            } catch (err) {
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
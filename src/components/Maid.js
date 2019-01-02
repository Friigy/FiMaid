import React, { Component } from 'react';
import { Grid, Button, Input, Menu, Header, Icon, Container, List, Breadcrumb } from 'semantic-ui-react';

class Maid extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.pathScan = this.pathScan.bind(this);
        this.folderScan = this.folderScan.bind(this);
        this.activateFolderItem = this.activateFolderItem.bind(this);
        this.navigatingFolder = this.navigatingFolder.bind(this);
        this.navigatingBread = this.navigatingFolder.bind(this);

        this.state = {
            pathToNewFolder: "",
            managedFolders: [],
            activeFolderItem: "",
            pathTargetedFolder: ""
        };
    }

    componentWillMount() {
        const fs = window.require('fs');
        var profileDiffers = false;
        var updatedManagedFolders = this.state.managedFolders;
        
        try {
            var content = fs.readFileSync("/home/friij/PersonalProject/fileManager/fimaid/PROFILE", 'utf-8');
            var lines = content.split('\n');
            lines.map(line => {
                if (line !== "Managed Folders:") {
                    var managedFolderActive = true;

                    try {
                        var tmp = fs.readFileSync(line + "/.fimaid", 'utf-8');
                    } catch (err) {
                        managedFolderActive = false;
                    }

                    if (managedFolderActive) {
                        updatedManagedFolders.push(line);
                    } else {
                        profileDiffers = true;
                    }
                }
            });

            if (profileDiffers) {
                try {
                    fs.writeFileSync("./PROFILE", "Managed Folders:", 'utf-8');
                    updatedManagedFolders.map(managedFolders => {
                        fs.appendFileSync("/home/friij/PersonalProject/fileManager/fimaid/PROFILE", "\n" + managedFolders, 'utf-8');
                    });
                } catch (err) {
                    console.log("ERROR");
                    console.log(err);
                }
            }
        
            this.setState({ managedFolders: updatedManagedFolders });
        } catch (err) {
            console.log("PROFILE doesn't exist.");
            console.log(err);
        }
    }
    
    handleChange(e) {
        this.setState({ pathToNewFolder: e.target.value });
    }
  
    activateFolderItem = (e, { name }) => this.setState({ activeFolderItem: name, pathTargetedFolder: name });
  
    navigatingFolder = (newFolder) => {
        var newPath = this.state.pathTargetedFolder + '/' + newFolder;
        this.setState({ pathTargetedFolder: newPath });
    }
  
    navigatingFolder = (newFolder) => {
        var newPath = this.state.pathTargetedFolder + '/' + newFolder;
        this.setState({ pathTargetedFolder: newPath });
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

        if (this.state.managedFolders.find((folderName) => {
            return folderName === this.state.pathToNewFolder;
        })) {
            console.log("This folder is already being managed!");
        } else {
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
                fs.appendFileSync("/home/friij/PersonalProject/fileManager/fimaid/PROFILE", "\n" + this.state.pathToNewFolder, 'utf-8');
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
                fs.writeFileSync(this.state.pathToNewFolder + "/.fimaid.json", JSON.stringify(folder), 'utf-8');
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
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
            try {
                folder.folderList.push(this.folderScan(path + "/" + entry));
            } catch (err) {
                folder.fileList.push(entry);
            }
        });

        return folder;
    }

    render() {
        const fs = window.require('fs');
        var folderList = [];
        var fileList = [];
        if (this.state.activeFolderItem !== "") {
            var readDir = fs.readdirSync(this.state.pathTargetedFolder);
    
            readDir.map(entry => {
                try {
                    this.folderScan(this.state.pathTargetedFolder + "/" + entry)
                    folderList.push(entry);
                } catch (err) {
                    fileList.push(entry);
                }
            });
        }

        var allThePath = this.state.activeFolderItem.split('/');
        allThePath.shift();
        var active = allThePath[allThePath.length - 1];
        var allTheTargetedPath = this.state.pathTargetedFolder.split('/');
        allTheTargetedPath.shift();
        var activeBread = allTheTargetedPath[allTheTargetedPath.length - 1];

        var pathToBread = "";

        for (var i = 0; i < allThePath.length - 2; i++) {
            pathToBread += "/" + allThePath[i];
        }

        console.log("bread");
        console.log(pathToBread);

        for (var i = 0; i < allThePath.length - 1; i++) {
            allTheTargetedPath.shift();
        }
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Menu fluid pointing secondary vertical>
                        <Menu.Item name="scan">
                            <div>
                                <Input type='text' placeholder='Your path here' onChange={this.handleChange} />
                                <Button type='submit' onClick={this.pathScan}>+</Button>
                            </div>
                        </Menu.Item>

                        <Menu.Item name="scan">
                            <Header as='h1'>
                                Managed folders
                            </Header>
                        </Menu.Item>
                        {
                            this.state.managedFolders.map(folder => {
                                return (
                                    <Menu.Item name={folder} active={this.state.activeFolderItem === folder} onClick={this.activateFolderItem}>
                                        <Icon name='right angle' /> {folder.replace('/', '\/')}
                                    </Menu.Item>
                                );
                            })
                        }
                    </Menu>
                </Grid.Column>

                <Grid.Column stretched width={13}>
                    <Container fluid>

                        <Header as='h2'>
                            Navigating {this.state.activeFolderItem}
                        </Header>
                        <Breadcrumb>
                            {
                                allTheTargetedPath.map(folder => {
                                    if (activeBread === folder) {
                                        return (
                                            <span>
                                                <Breadcrumb.Section active={activeBread === folder}>
                                                    {folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span>
                                                <Breadcrumb.Section link onClick={this.navigatingFolder}>
                                                    {folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    }
                                })
                            }
                        </Breadcrumb>
                        <Menu secondary>
                            {
                                this.state.activeFolderItem !== "" ?
                                <Grid>
                                    {
                                        folderList.map(entry => {
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item onClick={this.navigatingFolder.bind(this, entry)}>
                                                        <Container textAlign='center'>
                                                                <Icon
                                                                    name='folder'
                                                                    size='huge'
                                                                /> <br />
                                                                {entry}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            )
                                        })
                                    }
                                    {
                                        fileList.map(entry => {
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item>
                                                        <Container textAlign='center'>
                                                                <Icon
                                                                    name='file outline'
                                                                    size='huge'
                                                                /> <br />
                                                                {entry}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            )
                                        })
                                    }
                                </Grid>
                                : "Select a folder"
                            }
                        </Menu>
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Maid;
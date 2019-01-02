import React, { Component } from 'react';
import { Grid, Input, Menu, Header, Icon, Container, Breadcrumb } from 'semantic-ui-react';

class Maid extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChangeFolder = this.handleChangeFolder.bind(this);
        this.handleChangeTag = this.handleChangeTag.bind(this);
        this.pathScan = this.pathScan.bind(this);
        this.folderScan = this.folderScan.bind(this);
        this.addTagToFolder = this.addTagToFolder.bind(this);
        this.activateFolderItem = this.activateFolderItem.bind(this);
        this.navigatingFolder = this.navigatingFolder.bind(this);
        this.navigatingBread = this.navigatingBread.bind(this);

        this.state = {
            pathToNewFolder: "",
            tagToAdd: "",
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
    
    pathScan() {
        const fs = window.require('fs');
        var content = "";
        var folderExists = true;
        var updatedManagedFolders = this.state.managedFolders;
        var folder = {
            "name": "",
            "tags": [],
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
            "tags": [],
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
    
    handleChangeTag(e) {
        this.setState({ tagToAdd: e.target.value });
    }
    
    addTagToFolder() {
        const fs = window.require('fs');
        var content = "";
        var jsonExists = true;
        var jsonContent = [];
        var arrayManagedFolder = this.state.activeFolderItem.split('/');
        var pathManagedFolder = this.state.activeFolderItem;
        arrayManagedFolder.shift();
        var arrayTargetFolder = this.state.pathTargetedFolder.split('/');
        arrayTargetFolder.shift();

        var i;
        var j;

        for (i = 0; i < arrayManagedFolder.length; i++) {
            arrayTargetFolder.shift();
        }

        try {
            content = fs.readFileSync(this.state.activeFolderItem + "/.fimaid.json", 'utf-8');
        } catch (err) {
            jsonExists = false;
        }

        if (jsonExists) {
            jsonContent = JSON.parse(content);

            jsonContent.tags.push(this.state.tagToAdd);

            pathManagedFolder += "/" + arrayTargetFolder.shift();

            for (j = 0; j < jsonContent.folderList.length; j++) {
                if (pathManagedFolder === jsonContent.folderList[j].name) {
                    jsonContent.folderList[j] = this.addTagToFolderSon(pathManagedFolder, arrayTargetFolder, this.state.tagToAdd, jsonContent.folderList[j]);
                }
            }

            try {
                fs.writeFileSync(this.state.activeFolderItem + "/.fimaid.json", JSON.stringify(jsonContent), 'utf-8')
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
        }
    }

    addTagToFolderSon(path, arrayTargetFolder, tag, jsonContent) {
        var j;
        
        jsonContent.tags.push(tag);

        path += "/" + arrayTargetFolder.shift();

        for (j = 0; j < jsonContent.folderList.length; j++) {
            if (path === jsonContent.folderList[j].name) {
                jsonContent.folderList[j] = this.addTagToFolderSon(path, arrayTargetFolder, tag, jsonContent.folderList[j]);
            }
        }

        return jsonContent;
    }
    
    handleChangeFolder(e) {
        this.setState({ pathToNewFolder: e.target.value });
    }
  
    activateFolderItem = (e, { name }) => this.setState({ activeFolderItem: name, pathTargetedFolder: name });
  
    navigatingFolder = (newFolder) => {
        var newPath = this.state.pathTargetedFolder + '/' + newFolder;
        this.setState({ pathTargetedFolder: newPath });
    }
  
    navigatingBread = (newFolder) => this.setState({ pathTargetedFolder: newFolder });

    render() {
        const fs = window.require('fs');
        var folderList = [];
        var fileList = [];
        var active = "";
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
        active = allThePath[allThePath.length - 1];
        var allTheTargetedPath = this.state.pathTargetedFolder.split('/');
        allTheTargetedPath.shift();
        var activeBread = allTheTargetedPath[allTheTargetedPath.length - 1];

        var pathToBread = "";
        var breadcrumbsFolderPaths = [];

        for (var i = 0; i < allThePath.length; i++) {
            pathToBread += "/" + allThePath[i];
        }

        breadcrumbsFolderPaths.push({ "folder": active, "pathToFolder": pathToBread });

        for (i = 0; i < (allTheTargetedPath.length - allThePath.length); i++) {
            pathToBread += "/" + allTheTargetedPath[i + allThePath.length];
            breadcrumbsFolderPaths.push({ "folder": allTheTargetedPath[i + allThePath.length], "pathToFolder": pathToBread });
        }
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Menu fluid pointing secondary vertical>
                        <Menu.Item name="scan">
                            <Input
                                icon='folder'
                                iconPosition='left'
                                type='text'
                                placeholder='Your path here'
                                onChange={this.handleChangeFolder}
                                action={{ color: 'violet', content: 'Add', onClick: this.pathScan }}
                                actionPosition='right'
                            />
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
                                        <span><Icon name='right angle' /> {folder.replace('/', '\/')}</span>
                                    </Menu.Item>
                                );
                            })
                        }
                    </Menu>
                </Grid.Column>

                <Grid.Column stretched width={13}>
                    <Container fluid>
                        {
                            this.state.activeFolderItem !== "" ?
                            <Grid.Row>
                                <Header as='h2'>
                                    Tags for {activeBread}
                                </Header>
                                <Input
                                    icon='tags'
                                    iconPosition='left'
                                    type='text'
                                    placeholder='tag'
                                    onChange={this.handleChangeTag}
                                    action={{ color: 'violet', content: 'Add', onClick: this.addTagToFolder }}
                                    actionPosition='right'
                                />
                            </Grid.Row>
                            : null
                        }

                        {
                            this.state.activeFolderItem !== "" ?
                            <Header as='h2'>
                                Navigating {active}
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolderItem !== ""  ?
                            <Breadcrumb>
                            {
                                breadcrumbsFolderPaths.map(folder => {
                                    if (activeBread === folder.folder) {
                                        return (
                                            <span>
                                                <Breadcrumb.Section active={activeBread === folder.folder}>
                                                    {folder.folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span>
                                                <Breadcrumb.Section link onClick={this.navigatingBread.bind(this, folder.pathToFolder)}>
                                                    {folder.folder}
                                                </Breadcrumb.Section>
                                                <Breadcrumb.Divider icon='right angle'/>
                                            </span>
                                        );
                                    }
                                })
                            }
                            </Breadcrumb>
                            : null
                        }
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
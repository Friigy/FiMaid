import React, { Component } from 'react';
import { Grid, Input, Menu, Header, Icon, Container, Breadcrumb, Label, Popup } from 'semantic-ui-react';

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
        this.obtainListof = this.obtainListof.bind(this);
        this.handleChangeSearchTag = this.handleChangeSearchTag.bind(this);
        this.addTagToSearch = this.addTagToSearch.bind(this);
        this.addTagToInclude = this.addTagToInclude.bind(this);
        this.addTagToExclude = this.addTagToExclude.bind(this);
        this.deleteTagFromExclude = this.deleteTagFromExclude.bind(this);

        this.state = {
            pathToMain : "",
            pathToNewFolder: "",
            tagToAdd: "",
            managedFolders: [],
            activeFolderItem: "",
            pathTargetedFolder: "",
            tagToSearch: "",
            includeTag: [],
            excludeTag: []
        };
    }

    componentWillMount() {
        const fs = window.require('fs');
        const path = require('path');
        var profileDiffers = false;
        var updatedManagedFolders = this.state.managedFolders;
        var content = "";
        const fileWithMainPath = require("../resources/mainPath.json");

        try {
            content = fs.readFileSync(path.join(fileWithMainPath.mainPath, "PROFILE"), 'utf-8');
            var lines = content.split('\n');
            lines.map(line => {
                if (line !== "Managed Folders:") {
                    var managedFolderActive = true;

                    try {
                        var tmp = fs.readFileSync(path.join(line, ".fimaid"), 'utf-8');
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
                    fs.writeFileSync(path.join(fileWithMainPath.mainPath, "PROFILE"), "Managed Folders:", 'utf-8');
                    updatedManagedFolders.map(managedFolders => {
                        fs.appendFileSync(path.join(fileWithMainPath.mainPath, "PROFILE"), "\n" + managedFolders, 'utf-8');
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
        const path = require('path');
        var content = "";
        var folderExists = true;
        var updatedManagedFolders = this.state.managedFolders;
        const fileWithMainPath = require(path.join("..", "resources", "mainPath.json"));
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
                content = fs.readFileSync(path.join(this.state.pathToNewFolder, ".fimaid"), 'utf-8');
            } catch (err) {
                folderExists = false;
            }

            if (folderExists) {
                updatedManagedFolders.push(content);
                this.setState({ managedFolders: updatedManagedFolders });
            } else {
                try {
                    fs.writeFileSync(path.join(this.state.pathToNewFolder, ".fimaid"), this.state.pathToNewFolder, 'utf-8');
                } catch (err) {
                    console.log("ERROR");
                    console.log(err);
                }
                content = fs.readFileSync(path.join(this.state.pathToNewFolder, ".fimaid"), 'utf-8');
                updatedManagedFolders.push(content);
                this.setState({ managedFolders: updatedManagedFolders });
            }

            try {
                fs.appendFileSync(path.join(fileWithMainPath.mainPath, "PROFILE"), "\n" + this.state.pathToNewFolder, 'utf-8');
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
                fs.writeFileSync(path.join(this.state.pathToNewFolder + ".fimaid.json"), JSON.stringify(folder), 'utf-8');
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
        }
    }

    folderScan(pathFolder) {
        const fs = window.require('fs');
        const path = require('path');
        var folder = {
            "name": "",
            "tags": [],
            "folderList": [],
            "fileList": []
        }

        folder.name = pathFolder;
        var readDir = fs.readdirSync(pathFolder);

        readDir.map(entry => {
            try {
                folder.folderList.push(this.folderScan(path.join(pathFolder, entry)));
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
        const path = require('path');
        var content = "";
        var jsonExists = true;
        var jsonContent = [];
        var arrayManagedFolder = this.state.activeFolderItem.split(path.sep);
        var pathManagedFolder = this.state.activeFolderItem;
        var arrayTargetFolder = this.state.pathTargetedFolder.split(path.sep);

        if (path.sep === '/') {
            arrayManagedFolder.shift();
            arrayTargetFolder.shift();
        }

        var i;
        var j;

        for (i = 0; i < arrayManagedFolder.length; i++) {
            arrayTargetFolder.shift();
        }

        try {
            content = fs.readFileSync(path.join(this.state.activeFolderItem, ".fimaid.json"), 'utf-8');
        } catch (err) {
            jsonExists = false;
        }

        if (jsonExists) {
            jsonContent = JSON.parse(content);

            if (!jsonContent.tags.includes(this.state.tagToAdd)) {
                jsonContent.tags.push(this.state.tagToAdd);
            }
 
            pathManagedFolder += path.sep + arrayTargetFolder.shift();

            for (j = 0; j < jsonContent.folderList.length; j++) {
                if (pathManagedFolder === jsonContent.folderList[j].name) {
                    jsonContent.folderList[j] = this.addTagToFolderSon(pathManagedFolder, arrayTargetFolder, this.state.tagToAdd, jsonContent.folderList[j]);
                }
            }

            try {
                fs.writeFileSync(path.join(this.state.activeFolderItem, ".fimaid.json"), JSON.stringify(jsonContent), 'utf-8')
            } catch (err) {
                console.log("ERROR");
                console.log(err);
            }
        }
    }

    addTagToFolderSon(pathFolder, arrayTargetFolder, tag, jsonContent) {
        const path = require('path');
        var j;
        
        if (!jsonContent.tags.includes(this.state.tagToAdd)) {
            jsonContent.tags.push(tag);
        }

        pathFolder += path.sep + arrayTargetFolder.shift();

        for (j = 0; j < jsonContent.folderList.length; j++) {
            if (pathFolder === jsonContent.folderList[j].name) {
                jsonContent.folderList[j] = this.addTagToFolderSon(pathFolder, arrayTargetFolder, tag, jsonContent.folderList[j]);
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

    obtainListof(entry) {
        const fs = window.require('fs');
        const path = require('path');
        var listOf = [];
        var fileExist = true;
        var content;
        var jsonContent;
        var pathToTargetedFolder = this.state.pathTargetedFolder.split(path.sep);
        var pathTarget = "";
        var j;

        if (path.sep === '\\') {
            pathTarget = pathToTargetedFolder[0];
        }

        pathToTargetedFolder.shift();

        try {
            content = fs.readFileSync(path.join(this.state.activeFolderItem, ".fimaid.json"), 'utf-8');
        } catch (err) {
            fileExist = false;
        }

        if (fileExist) {
            jsonContent = JSON.parse(content);

            for (var i = 0; i < pathToTargetedFolder.length; i++) {
                pathTarget += path.sep + pathToTargetedFolder[i];

                for (j = 0; j < jsonContent.folderList.length; j++) {
                    if (pathTarget === jsonContent.folderList[j].name) {
                        jsonContent = jsonContent.folderList[j];
                    }
                }
            }
            switch (entry) {
                case "tags":
                    listOf = jsonContent.tags;
                    break;
                case "folders":
                    listOf = jsonContent.folderList;
                    break;
            }
        }

        return listOf;
    }
    
    handleChangeSearchTag(e) {
        this.setState({ tagToSearch: e.target.value });
    }
    
    addTagToSearch() {
        var tagToSearch = this.state.tagToSearch.split(',');
        var newIncludeTags = this.state.includeTag;
        var newExcludeTags = this.state.excludeTag;

        for (var i = 0; i < tagToSearch.length; i++) {
            if (!newIncludeTags.includes(tagToSearch[i]) && !newExcludeTags.includes(tagToSearch[i])) {
                newIncludeTags.push(tagToSearch[i]);
            }
        }

        this.setState({ includeTag: newIncludeTags });
    }
    
    addTagToInclude(tag) {
        var newIncludeTags = this.state.includeTag;
        var newExcludeTags = this.state.excludeTag;

        if (!newIncludeTags.includes(tag) && !newExcludeTags.includes(tag)) {
            newIncludeTags.push(tag);
        }

        this.setState({ includeTag: newIncludeTags });
    }
    
    addTagToExclude(tag) {
        var oldIncludeTags = this.state.includeTag;
        var newIncludeTags = [];
        var newExcludeTags = this.state.excludeTag;

        newExcludeTags.push(tag);
        newIncludeTags.indexOf(tag);

        for (var i = 0; i < oldIncludeTags.length; i++) {
            if (oldIncludeTags[i] !== tag) {
                newIncludeTags.push(oldIncludeTags[i]);
            }
        }

        this.setState({ "includeTag": newIncludeTags, "excludeTag": newExcludeTags });
    }
    
    deleteTagFromExclude(tag) {
        var oldExcludeTags = this.state.excludeTag;
        var newExcludeTags = [];

        for (var i = 0; i < oldExcludeTags.length; i++) {
            if (oldExcludeTags[i] !== tag) {
                newExcludeTags.push(oldExcludeTags[i]);
            }
        }

        this.setState({ excludeTag: newExcludeTags });
    }

    render() {
        const fs = window.require('fs');
        const path = require('path');
        var folderList = [];
        var fileList = [];
        var tagList = [];
        var folderListForTags = this.obtainListof("folders");
        var folderListofTags;
        var active = "";
        var colorList = [ 'pink', 'orange', 'yellow', 'olive', 'teal', 'teal', 'blue', 'violet', 'purple', 'pink' ];
        var i;

        if (this.state.activeFolderItem !== "") {
            var readDir = fs.readdirSync(this.state.pathTargetedFolder);
    
            readDir.map(entry => {
                try {
                    this.folderScan(path.join(this.state.pathTargetedFolder, entry))
                    for (var i = 0; i < folderListForTags.length; i++) {
                        if (path.join(this.state.pathTargetedFolder, entry) === folderListForTags[i].name) {
                            folderListofTags = folderListForTags[i].tags;
                        }
                    }
                    folderList.push({ "entry": entry, "tags": folderListofTags });
                } catch (err) {
                    fileList.push(entry);
                }
            });
        }

        tagList = this.obtainListof("tags");

        var allThePath = this.state.activeFolderItem.split(path.sep);
        active = allThePath[allThePath.length - 1];
        var allTheTargetedPath = this.state.pathTargetedFolder.split(path.sep);
        var activeBread = allTheTargetedPath[allTheTargetedPath.length - 1];

        var pathToBread = this.state.activeFolderItem;
        var breadcrumbsFolderPaths = [];

        if (path.sep === '/') {
            allThePath.shift();
            allTheTargetedPath.shift();
        }

        breadcrumbsFolderPaths.push({ "folder": active, "pathToFolder": pathToBread });

        for (i = 0; i < (allTheTargetedPath.length - allThePath.length); i++) {
            pathToBread += path.sep + allTheTargetedPath[i + allThePath.length];
            breadcrumbsFolderPaths.push({ "folder": allTheTargetedPath[i + allThePath.length], "pathToFolder": pathToBread });
        }

        var tagsToInclude = this.state.includeTag;
        var tagsToExclude = this.state.excludeTag;
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
                            <Header as='h2'>
                                Tags for {activeBread}
                            </Header>
                            : null
                        }
                        {
                            this.state.activeFolderItem !== "" ?
                            <Grid.Row>
                                <Input
                                    icon='search'
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
                        <br/>
                        {
                            this.state.activeFolderItem !== "" ?
                            <Grid.Row>
                                {
                                    tagList.map(tag => {
                                        return (
                                            <Label color={colorList[Math.floor((Math.random() * 10))]} image onClick={this.addTagToInclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
                            </Grid.Row>
                            : null
                        }
                        <br />
                        {
                            this.state.activeFolderItem !== "" ?
                            <Grid.Row>
                                <Popup
                                    trigger={
                                        <Input
                                            icon='tags'
                                            iconPosition='left'
                                            type='text'
                                            placeholder='Search for specific tags'
                                            onChange={this.handleChangeSearchTag}
                                            action={{ color: 'olive', content: 'Search', onClick: this.addTagToSearch }}
                                            actionPosition='right'
                                        />
                                    }
                                    content='Write your tags separated by a comma, no spaces "music,work,pictures,..."'
                                    position='right center'
                                    wide='very'
                                    style={{ opacity: 0.7 }}
                                    inverted
                                />
                            </Grid.Row>
                            : null
                        }
                        <br/>
                        {
                            this.state.activeFolderItem !== "" ?
                            <Grid.Row>
                                {
                                    tagsToInclude.map(tag => {
                                        return (
                                            <Label color='green' image onClick={this.addTagToExclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
                                {
                                    tagsToExclude.map(tag => {
                                        return (
                                            <Label color='red' image onClick={this.deleteTagFromExclude.bind(this, tag)}>
                                                <Icon name='tags' /> {tag}
                                            </Label>
                                        )
                                    })
                                }
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
                                            var colorFolder = "";
                                            var numberOfInclusion = [];
                                            var numberOfExclusion = [];
                                            
                                            for (var i = 0; i < this.state.includeTag.length; i++) {
                                                if (entry.tags.includes(this.state.includeTag[i])) {
                                                    numberOfInclusion.push("true");
                                                } else {
                                                    numberOfInclusion.push("false");
                                                }
                                            }
                                            
                                            for (i = 0; i < this.state.excludeTag.length; i++) {
                                                if (entry.tags.includes(this.state.excludeTag[i])) {
                                                    numberOfExclusion.push("true");
                                                } else {
                                                    numberOfExclusion.push("false");
                                                }
                                            }

                                            if (numberOfInclusion.includes("true") && numberOfInclusion.includes("false")) {
                                                colorFolder = "olive";
                                            } else if (numberOfInclusion.includes("true")) {
                                                colorFolder = "green";
                                            } else {
                                                colorFolder = "grey";
                                            }

                                            if (numberOfExclusion.includes("true") && numberOfInclusion.includes("true")) {
                                                colorFolder = "orange";
                                            } else if (numberOfExclusion.includes("true")) {
                                                colorFolder = "red";
                                            }
                                            return (
                                                <Grid.Column width={2}>
                                                    <Menu.Item onClick={this.navigatingFolder.bind(this, entry.entry)}>
                                                        <Container textAlign='center'>
                                                                <Icon
                                                                    name='folder'
                                                                    size='huge'
                                                                    color={colorFolder}
                                                                /> <br />
                                                                {entry.entry}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            );
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
                                                                    color='grey'
                                                                /> <br />
                                                                {entry}
                                                        </Container>
                                                    </Menu.Item>
                                                </Grid.Column>
                                            )
                                        })
                                    }
                                </Grid>
                                : null
                            }
                        </Menu>
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Maid;
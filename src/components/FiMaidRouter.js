import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import ScanFolders from "./ScanFolders";
import TagFolders from "./TagFolders";
import Settings from "./Settings";
import NavBar from './NavBar';

class FiMaidRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar />
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={Home}
                        />
                        <Route
                            exact
                            path="/scan"
                            component={ScanFolders}
                        />
                        <Route
                            exact
                            path="/tag"
                            component={TagFolders}
                        />
                        <Route
                            exact
                            path="/settings"
                            component={Settings}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default FiMaidRouter;
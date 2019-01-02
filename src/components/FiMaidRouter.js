import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Maid from "./Maid";
import Settings from "./Settings";
import NavBar from './NavBar';

class FiMaidRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar />
                    <div>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                component={Home}
                            />
                            <Route
                                exact
                                path="/maid"
                                component={Maid}
                            />
                            <Route
                                exact
                                path="/settings"
                                component={Settings}
                            />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default FiMaidRouter;
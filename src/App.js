import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useWeb3Provider, Web3Context } from "./hooks/web3";

import HomePage from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

const AboutPage = () => <div>About Page</div>;
const TeamPage = () => <div> Team Page</div>;
const IssuesPage = () => <div>Issues Page</div>;

const App = () => {
  const { web3 } = useWeb3Provider();
  return (
    <Web3Context.Provider value={web3}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/home" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/issues" component={IssuesPage} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </Web3Context.Provider>
  );
};

export default App;

import './App.css';
import KYC from './KYC';
import { Switch, Route } from 'react-router-dom'

import KYCForm from './KYCForm';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/basic' component={KYC}/>
        <Route path='/form' component={KYCForm}/>
      </Switch>
    </div>
  );
}

export default App;

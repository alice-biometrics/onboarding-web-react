import './App.css';
import KYC from './KYC';
import { Switch, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={KYC}/>
      </Switch>
    </div>
  );
}

export default App;

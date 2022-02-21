import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <div>
    <h1>Welcome to the Alice Web SDK React Demo!</h1>
    <nav>
      <ul>
        <li><Link to='/basic'>Basic demo without configuration</Link></li>
        <li><Link to='/form'>Basic demo with simple form configuration</Link></li>
      </ul>
    </nav>
  </div>
)

export default Home
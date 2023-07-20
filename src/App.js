import Thoughts from './components/Thoughts'
import Header from './components/Header'
import Task from './components/Task'
import Stack from 'react-bootstrap/Stack'
import './App.css';


function App() {
  return (
    <div className="container">
      <div className="task-container">
        <Task />
      </div>
      <div className="thoughts-container">
        <Thoughts />
      </div>
    </div>
  );
}

export default App;

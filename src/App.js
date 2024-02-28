import { AppBar, Toolbar, Typography } from '@mui/material';
import './App.css';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>
            Carshop
          </Typography>
        </Toolbar>
      </AppBar>

      <Login />
    </div>
  );
}

export default App;

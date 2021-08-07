import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Login from './Login'
import TikTok from './TikTok';

const code = new URLSearchParams(window.location.search).get('code')
function App() {
  return code ? <TikTok style={{backgroundColor: '#121212'}}code={code} /> : <Login style={{backgroundColor: '#121212'}} />
}

export default App;

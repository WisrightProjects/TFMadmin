import './App.scss';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'redux/store';
import Container from './container';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/custom.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Container />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

import { Route, Routes } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Shuffler from './components/Shuffler';
import Cards from './components/shuffler/Cards';
import Game from './components/shuffler/Game';

function App() {
  return (
    <>
      <MainNavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shuffler" element={<Shuffler />} />
          <Route path="/shuffler/cards" element={<Cards />} />
          <Route path="/shuffler/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

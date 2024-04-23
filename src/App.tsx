import { Route, Routes } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Shuffler from './components/Shuffler';
import Cards from './components/shuffler/Cards';

function App() {
  return (
    <>
      <MainNavBar />
      <main className="page-center p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shuffler" element={<Shuffler />} />
          <Route path="/shuffler/cards" element={<Cards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

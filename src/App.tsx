import { Route, Routes } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import Home from './components/Home';
import NotFound from './components/NotFound';

function App() {
  return (
    <>
      <MainNavBar />
      <main className="page-center p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import PLP from './pages/PLP';
import PDP from './pages/PDP';

function App() {
  return (
    <Router>
      <div className="App pt-20"> {/* Padding for fixed header */}
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/all" replace />} />
          <Route path="/:categoryName" element={<PLP />} />
          <Route path="/product/:id" element={<PDP />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

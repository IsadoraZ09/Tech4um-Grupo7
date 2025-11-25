import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestSocket from './TestSocket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-socket" element={<TestSocket />} />
        {/* outras rotas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
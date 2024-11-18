import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserDetails from './UserDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/users/:userId" element={<UserDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

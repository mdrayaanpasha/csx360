import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BrandDetails from './BrandDetails';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Routes>
          <Route path="/brand/:brandId" element={<BrandDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

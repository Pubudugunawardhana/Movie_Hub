import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Search from './pages/Search';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Subscription from './pages/Subscription';
import Payment from './pages/Payment';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import FAQ from './pages/FAQ';
import Watch from './pages/Watch';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/watch/:id" element={<Watch />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

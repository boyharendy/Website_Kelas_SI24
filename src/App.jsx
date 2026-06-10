import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Achievements from './components/Achievements';
import Students from './components/Students';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-bg-primary min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Achievements />
        <Students />
        <Gallery />
        <Guestbook />
      </main>
      <Footer />
    </div>
  );
}

export default App;

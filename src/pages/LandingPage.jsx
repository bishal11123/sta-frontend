// src/pages/LandingPage.jsx
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import ScrollToTop from '../components/ScrollToTop';
import Navbar from '../components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';



const LandingPage = () => {
  useEffect(() => {
    document.title = 'NICE Japanese Consultancy | Learn & Go Japan';
  }, []);

  return (
    <main className="font-sans bg-gray-50 text-gray-800">
        <Navbar />
        


                

      <Hero />

      <div className="max-w-7xl mx-auto px-4">
        <Stats />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </div>
      <ScrollToTop />
    </main>
  );
};

export default LandingPage;

"use client";
// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import { CalculatorProvider } from '../context/CalculatorContext';
import { PremiumProvider } from '../lib/premium';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-gray-50 h-full`}>
        <PremiumProvider>
          <CalculatorProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 min-h-0">{children}</main>
            </div>
          </CalculatorProvider>
        </PremiumProvider>
      </body>
    </html>
  );
}
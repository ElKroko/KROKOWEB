"use client"

import Link from "next/link"
import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <nav className="bg-dark-bg shadow-sm py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-light">
          KROKOWEB
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/music" className="hover:text-primary-light">Música</Link>
          <Link href="/visual" className="hover:text-primary-light">Arte Visual</Link>
          <Link href="/programming" className="hover:text-primary-light">Programación</Link>
          <Link href="/trading" className="hover:text-primary-light">Trading</Link>
          <Link href="/emed" className="hover:text-primary-light">EMED</Link>
          <Link href="/about" className="hover:text-primary-light">Sobre Mí</Link>
        </div>
        
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2"
            aria-label="Menú de navegación"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-bg px-4 py-2">
          <div className="flex flex-col space-y-3">
            <Link href="/music" className="py-2 hover:text-primary-light">Música</Link>
            <Link href="/visual" className="py-2 hover:text-primary-light">Arte Visual</Link>
            <Link href="/programming" className="py-2 hover:text-primary-light">Programación</Link>
            <Link href="/trading" className="py-2 hover:text-primary-light">Trading</Link>
            <Link href="/emed" className="py-2 hover:text-primary-light">EMED</Link>
            <Link href="/about" className="py-2 hover:text-primary-light">Sobre Mí</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
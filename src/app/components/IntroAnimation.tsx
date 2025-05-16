'use client'

import { useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function IntroAnimation() {
  const brainRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<HTMLSpanElement[]>([])
  const phone1Ref = useRef<HTMLDivElement>(null)
  const phone2Ref = useRef<HTMLDivElement>(null)
  const scrollArrowRef = useRef<HTMLDivElement>(null)

  // Fonction pour scroller vers la section suivante
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('section-2')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Animation du cerveau qui monte puis redescend légèrement
    if (brainRef.current) {
      brainRef.current.style.opacity = '0'
      brainRef.current.style.transform = 'translateY(40px)'
      
      setTimeout(() => {
        if (brainRef.current) {
          brainRef.current.style.transition = 'opacity 1s ease, transform 1.2s ease'
          brainRef.current.style.opacity = '1'
          brainRef.current.style.transform = 'translateY(0)'
        }
      }, 300)
    }

    // Animation des téléphones qui apparaissent doucement
    if (phone1Ref.current && phone2Ref.current) {
      phone1Ref.current.style.opacity = '0'
      phone2Ref.current.style.opacity = '0'
      
      setTimeout(() => {
        if (phone1Ref.current && phone2Ref.current) {
          phone1Ref.current.style.transition = 'opacity 1s ease, transform 1.2s ease'
          phone2Ref.current.style.transition = 'opacity 1s ease, transform 1.2s ease'
          phone1Ref.current.style.opacity = '0.85'
          phone2Ref.current.style.opacity = '0.85'
        }
      }, 1200)
    }

    // Animation du texte qui apparaît lettre par lettre
    letterRefs.current.forEach((letter, index) => {
      if (letter) {
        letter.style.opacity = '0'
        letter.style.transform = 'translateY(20px)'
        
        setTimeout(() => {
          if (letter) {
            letter.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
            letter.style.opacity = '1'
            letter.style.transform = 'translateY(0)'
          }
        }, 1000 + (index * 80))
      }
    })

    // Animation de la flèche de défilement
    if (scrollArrowRef.current) {
      scrollArrowRef.current.style.opacity = '0'
      
      setTimeout(() => {
        if (scrollArrowRef.current) {
          scrollArrowRef.current.style.transition = 'opacity 0.5s ease'
          scrollArrowRef.current.style.opacity = '1'
        }
      }, 2000)
    }
  }, [])

  // Divise le texte en lettres individuelles pour l'animation
  const text = "NeuralBooster"
  
  // Fonction pour créer le mockup de téléphone
  const PhoneMockup = ({ className = "", style = {} }) => (
    <div className={`relative ${className}`} style={style}>
      <div className="w-32 h-[220px] md:w-40 md:h-[280px] rounded-[30px] border-4 border-foreground/20 bg-white shadow-lg flex flex-col overflow-hidden">
        <div className="h-6 bg-foreground/5 flex justify-center items-center">
          <div className="w-20 h-4 rounded-full bg-foreground/10"></div>
        </div>
        <div className="flex-1 bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center">
          <img 
            src="/brian-illustration.svg" 
            alt="Brain Illustration" 
            className="w-16 h-16 md:w-20 md:h-20 opacity-70"
          />
        </div>
        <div className="h-12 bg-foreground/5 flex justify-center items-center">
          <div className="w-12 h-4 rounded-full bg-foreground/10"></div>
        </div>
      </div>
    </div>
  )
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div 
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Téléphone flottant à gauche */}
        <div 
          ref={phone1Ref} 
          className="absolute left-[-120px] md:left-[-250px] top-1/2 transform -translate-y-1/2"
          style={{ animation: 'float 6s infinite ease-in-out 1s' }}
        >
          <PhoneMockup 
            className="transform -rotate-12"
          />
        </div>
        
        {/* Téléphone flottant à droite */}
        <div 
          ref={phone2Ref} 
          className="absolute right-[-120px] md:right-[-250px] top-1/2 transform -translate-y-1/2"
          style={{ animation: 'float 7s infinite ease-in-out 0.5s' }}
        >
          <PhoneMockup 
            className="transform rotate-12"
          />
        </div>
        
        {/* Cerveau central */}
        <div 
          ref={brainRef} 
          className="mb-8 z-10"
        >
          <img 
            src="/brian-illustration.svg" 
            alt="Brain Illustration" 
            width={250} 
            height={250} 
            className="w-40 h-40 md:w-64 md:h-64"
          />
        </div>
        
        {/* Texte NeuralBooster */}
        <div className="text-4xl md:text-6xl font-bold text-primary z-10">
          {Array.from(text).map((letter, index) => (
            <span 
              key={index} 
              ref={el => {
                if (el) letterRefs.current[index] = el
              }}
              className="inline-block"
            >
              {letter}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 
'use client'

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import IntroAnimation from "./components/IntroAnimation";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  RadialBarChart, 
  RadialBar,
  XAxis,
  YAxis
} from 'recharts';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  
  const [activeSection, setActiveSection] = useState(0);
  
  // Données pour les graphiques
  const progressData = [
    { name: 'Jour 1', value: 10 },
    { name: 'Jour 7', value: 25 },
    { name: 'Jour 14', value: 40 },
    { name: 'Jour 30', value: 65 },
    { name: 'Jour 60', value: 90 },
  ];
  
  const skillsData = [
    { name: 'Mémoire', value: 80, fill: '#4361ee' },
    { name: 'Logique', value: 75, fill: '#3f37c9' },
    { name: 'Créativité', value: 85, fill: '#3a0ca3' },
    { name: 'Concentration', value: 70, fill: '#7209b7' },
  ];
  
  const usageData = [
    { name: 'Débutant', value: 20, fill: '#4361ee' },
    { name: 'Intermédiaire', value: 35, fill: '#3a0ca3' },
    { name: 'Expert', value: 45, fill: '#7209b7' },
  ];
  
  // Détection de la section active
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      if (section1Ref.current && scrollPosition < section1Ref.current.offsetTop + section1Ref.current.offsetHeight) {
        setActiveSection(0);
      } else if (section2Ref.current && scrollPosition < section2Ref.current.offsetTop + section2Ref.current.offsetHeight) {
        setActiveSection(1);
      } else if (section3Ref.current && scrollPosition < section3Ref.current.offsetTop + section3Ref.current.offsetHeight) {
        setActiveSection(2);
      } else if (section3Ref.current) {
        setActiveSection(3);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation entre sections
  const scrollToSection = (index: number) => {
    const sections = [section1Ref, section2Ref, section3Ref];
    if (sections[index].current) {
      window.scrollTo({
        top: sections[index].current!.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-white">
      {/* Section 1: Intro */}
      <section 
        ref={section1Ref}
        id="section-1"
        className="min-h-screen w-full flex items-center justify-center bg-white relative motion-section"
      >
        <div className="w-full h-full flex items-center justify-center">
          <IntroAnimation />
        </div>
      </section>
      
      {/* Section 2: Graphiques */}
      <section 
        ref={section2Ref}
        id="section-2"
        className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-[#f0f4ff] relative py-20 motion-section"
      >
        <div className="max-w-6xl px-8 py-16 w-full">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative inline-block">
              {/* Arcs électriques à gauche */}
              <motion.svg 
                className="absolute -left-16 top-1/2 transform -translate-y-1/2 h-20 w-20 text-primary"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0.3, 0.7, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <motion.path 
                  d="M70 50 L90 20 L75 40 L95 30 L65 50 L85 70 L60 60" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.svg>
              
              {/* Arcs électriques à droite */}
              <motion.svg 
                className="absolute -right-16 top-1/2 transform -translate-y-1/2 h-20 w-20 text-primary"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0.3, 0.7, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <motion.path 
                  d="M30 50 L10 20 L25 40 L5 30 L35 50 L15 70 L40 60" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    delay: 0.1,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.svg>
              
              {/* Éclairs multiples autour du titre - RÉDUIT */}
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.svg
                    key={i}
                    className="absolute h-10 w-10 text-primary pointer-events-none"
                    style={{
                      top: '50%',
                      left: '50%',
                      x: x - 20,
                      y: y - 20,
                      opacity: 0.7
                    }}
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 0.7, 0],
                      scale: [0, 1, 0],
                      rotate: [0, Math.random() * 10 - 5]
                    }}
                    transition={{
                      duration: 0.9 + Math.random() * 0.3,
                      delay: i * 0.25,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3 + 1
                    }}
                  >
                    <path 
                      d="M13 1L6 12H12L4 23L21 9H12L13 1Z" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                );
              })}
              
              {/* Particules d'électricité statique - RÉDUITES */}
              <motion.div 
                className="absolute -inset-8 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "radial-gradient(circle, rgba(67,97,238,0.1) 0%, rgba(114,9,183,0.03) 50%, rgba(255,255,255,0) 70%)",
                  zIndex: -1
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-primary"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      filter: "blur(0.5px)",
                      boxShadow: "0 0 5px 1px rgba(67,97,238,0.5)"
                    }}
                    animate={{
                      scale: [0, Math.random() * 1.2 + 0.3, 0],
                      opacity: [0, 0.7, 0],
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, (Math.random() - 0.5) * 40],
                    }}
                    transition={{
                      duration: 1.2 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.15,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </motion.div>
              
              <h2 className="text-xl md:text-4xl font-bold bg-primary text-white px-6 py-4 rounded-lg inline-block mb-4 relative z-10 shadow-[0_0_10px_rgba(67,97,238,0.5)]">
                Boostez votre cerveau en 5 min par jour
              </h2>
            </div>
            <p className="text-xl md:text-xl text-foreground/80 max-w-3xl mx-auto">
              Des mini-jeux pour stimuler vos capacités cognitives.
            </p>
          </motion.div>
          
          {/* Écrans de l'application */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-16 max-w-5xl mx-auto">
            <motion.div
              className="w-full md:w-1/3 max-w-[220px]"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5 }
              }}
              viewport={{ once: true }}
              animate={{ 
                y: [0, -8, 0],
                rotate: [-1, 1, -1]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0
              }}
            >
              <div className="relative flex flex-col items-center group">
                {/* Effets de lumière */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary/20 blur-[10px] rounded-[32px] -z-10 opacity-0 group-hover:opacity-70"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.05, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#BCBCBC] to-[#BCBCBC]/70 blur-[3px] rounded-full transform scale-90 -z-10"></div>
                
                {/* Effet d'interaction */}
                <motion.div 
                  className="absolute inset-0 bg-primary/10 rounded-[32px] opacity-0"
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                />
                
                <motion.img 
                  src="/ecran1.png" 
                  alt="Jeu de significaton" 
                  className="w-full h-auto"
                  style={{ 
                    maxHeight: "380px", 
                    objectFit: "contain",
                    filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.15))"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div
              className="w-full md:w-1/3 max-w-[220px] mt-4 md:mt-0"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: 0.1 }
              }}
              viewport={{ once: true }}
              animate={{ 
                y: [-5, 5, -5],
                rotate: [1, -1, 1]
              }}
              transition={{
                duration: 4.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.2
              }}
            >
              <div className="relative flex flex-col items-center group">
                {/* Effets de lumière */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-primary/20 blur-[10px] rounded-[32px] -z-10 opacity-0 group-hover:opacity-70"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.05, 0.8]
                  }}
                  transition={{
                    duration: 3.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#BCBCBC]/90 to-[#BCBCBC]/60 blur-[3px] rounded-full transform scale-90 -z-10"></div>
                
                {/* Effet d'interaction */}
                <motion.div 
                  className="absolute inset-0 bg-secondary/10 rounded-[32px] opacity-0"
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                />
                
                <motion.img 
                  src="/ecran2.png" 
                  alt="Jeu Memory Grid" 
                  className="w-full h-auto"
                  style={{ 
                    maxHeight: "380px", 
                    objectFit: "contain",
                    filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.15))"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div
              className="w-full md:w-1/3 max-w-[220px] mt-4 md:mt-0"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: 0.2 }
              }}
              viewport={{ once: true }}
              animate={{ 
                y: [-3, 7, -3],
                rotate: [-1.2, 1.2, -1.2]
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.4
              }}
            >
              <div className="relative flex flex-col items-center group">
                {/* Effets de lumière */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/30 blur-[10px] rounded-[32px] -z-10 opacity-0 group-hover:opacity-70"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.05, 0.8]
                  }}
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#BCBCBC]/80 to-[#BCBCBC]/50 blur-[3px] rounded-full transform scale-90 -z-10"></div>
                
                {/* Effet d'interaction */}
                <motion.div 
                  className="absolute inset-0 bg-primary/10 rounded-[32px] opacity-0"
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                />
                
                <motion.img 
                  src="/ecran3.png" 
                  alt="Jeu de cartes" 
                  className="w-full h-auto"
                  style={{ 
                    maxHeight: "380px", 
                    objectFit: "contain",
                    filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.15))"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* CTA à la place des graphiques */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >

          </motion.div>
        </div>
      </section>
      
      {/* Nouvelle section: Études scientifiques */}
      <section 
        id="section-studies"
        className="min-h-screen w-full flex items-center justify-center bg-[#f0f4ff] relative py-20 motion-section"
      >
        <div className="max-w-6xl px-8 py-16 w-full">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-xl md:text-4xl font-bold px-6 py-4 mb-4 text-foreground relative">
              <span className="relative">
                La science derrière Neural Booster
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#7209b7] to-primary rounded-full"
                  initial={{ width: 0, left: "50%", opacity: 0 }}
                  whileInView={{ width: "100%", left: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                />
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-white/50 rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "100%", opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1.4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2.5
                  }}
                  viewport={{ once: true }}
                  style={{
                    filter: "blur(1px)"
                  }}
                />
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
              Des études scientifiques prouvent l'efficacité des jeux cognitifs
            </p>
          </motion.div>
          
          {/* Cerveau interactif */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-20">
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div 
                className="relative h-[300px] md:h-[400px] w-full bg-white p-4 rounded-xl shadow-sm overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 10px 25px -5px rgba(67, 97, 238, 0.3)",
                  translateY: -5
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Effet de particules flottantes */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full z-10 pointer-events-none"
                    style={{
                      width: Math.random() * 6 + 2 + "px",
                      height: Math.random() * 6 + 2 + "px",
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: i % 3 === 0 ? "#4361ee" : i % 3 === 1 ? "#7209b7" : "#3a0ca3",
                      opacity: 0.4
                    }}
                    animate={{
                      y: [0, Math.random() * -30 - 10],
                      x: [0, (Math.random() * 20) - 10],
                      opacity: [0.4, 0]
                    }}
                    transition={{
                      duration: Math.random() * 2 + 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: Math.random() * 5
                    }}
                  />
                ))}
                
                <motion.h3 
                  className="text-lg font-medium mb-3 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Amélioration des fonctions cognitives sur 8 semaines
                </motion.h3>
                
                {/* Animation de dessin du graphique */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {/* Graphique de progression avec Recharts */}
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { semaine: 'S0', mémoire: 40, concentration: 35, logique: 30 },
                        { semaine: 'S1', mémoire: 45, concentration: 38, logique: 34 },
                        { semaine: 'S2', mémoire: 52, concentration: 42, logique: 40 },
                        { semaine: 'S3', mémoire: 58, concentration: 48, logique: 45 },
                        { semaine: 'S4', mémoire: 64, concentration: 55, logique: 52 },
                        { semaine: 'S6', mémoire: 75, concentration: 67, logique: 64 },
                        { semaine: 'S8', mémoire: 85, concentration: 78, logique: 72 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorMemoire" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4361ee" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4361ee" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorConcentration" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7209b7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#7209b7" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorLogique" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3a0ca3" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3a0ca3" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="semaine" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickCount={6} 
                        domain={[0, 100]} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Score cognitif', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: '#666' } }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mémoire" 
                        stroke="#4361ee" 
                        fillOpacity={1} 
                        fill="url(#colorMemoire)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="concentration" 
                        stroke="#7209b7" 
                        fillOpacity={1} 
                        fill="url(#colorConcentration)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="logique" 
                        stroke="#3a0ca3" 
                        fillOpacity={1} 
                        fill="url(#colorLogique)" 
                        strokeWidth={2}
                      />
                      
                      {/* Légende personnalisée avec animations */}
                      <foreignObject x="55%" y="5%" width="45%" height="30%">
                        <div className="flex flex-col space-y-2">
                          {[
                            { label: "Mémoire", color: "#4361ee", delay: 0.6 },
                            { label: "Concentration", color: "#7209b7", delay: 0.8 },
                            { label: "Logique", color: "#3a0ca3", delay: 1.0 }
                          ].map((item, i) => (
                            <motion.div 
                              key={i} 
                              className="flex items-center"
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: item.delay }}
                              viewport={{ once: true }}
                            >
                              <motion.div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: item.color }}
                                whileHover={{ scale: 1.5 }}
                              />
                              <span className="text-xs">{item.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </foreignObject>
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-2 right-2 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  viewport={{ once: true }}
                >
                  <span>*Basé sur une étude de 2023 avec 5 min d'entraînement quotidien</span>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.h3 
                className="text-2xl font-bold mb-6 text-primary relative"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                L'entraînement cérébral validé scientifiquement
              </motion.h3>
              <div className="space-y-6 text-foreground/80">
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Une étude publiée dans le <motion.span 
                    className="font-semibold" 
                    whileHover={{ 
                      color: "#4361ee",
                      transition: { duration: 0.2 }
                    }}
                  >Journal of Cognitive Enhancement</motion.span> (2023) a démontré que seulement 5 minutes d'entraînement quotidien avec des mini-jeux cognitifs améliorent significativement :
                </motion.p>
                <ul className="space-y-4">
                  {[
                    { text: "La mémoire de travail de 26% en moyenne après 6 semaines", color: "#4361ee" },
                    { text: "La vitesse de traitement cognitif de 19% après seulement 1 mois", color: "#3a0ca3" },
                    { text: "La capacité de concentration soutenue de 31% après 2 mois", color: "#7209b7" },
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div 
                        className="mt-1.5 min-w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 10, 
                          delay: 0.5 + i * 0.2 
                        }}
                        viewport={{ once: true }}
                      />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="absolute -left-2 -right-2 -top-2 -bottom-2 bg-primary/5 rounded-lg -z-10"
                    animate={{ 
                      boxShadow: ["0 0 0px rgba(67,97,238,0)", "0 0 15px rgba(67,97,238,0.3)", "0 0 0px rgba(67,97,238,0)"]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <p className="text-lg italic border-l-4 border-primary/30 pl-4 mt-6">
                    "Les mini-jeux cognitifs comme ceux de Neural Booster représentent une méthode efficace et scientifiquement validée pour améliorer la plasticité cérébrale à tout âge."
                    <motion.span 
                      className="block text-sm mt-2 font-semibold"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.4 }}
                      viewport={{ once: true }}
                    >
                      — Dr. Sarah Roberts, Neuroscientifique
                    </motion.span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section 3: Formulaire */}
      <section 
        ref={section3Ref}
        id="section-3"
        className="min-h-screen w-full flex items-center justify-center bg-[#f0f4ff] relative py-20 motion-section"
      >
        <div className="max-w-4xl px-8 py-16 w-full mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Cercles décoratifs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-secondary/10"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-foreground text-center">
                Transformez votre créativité avec <span className="text-primary">Neural Booster</span>
              </h3>
              
              <motion.form 
                className="bg-primary/5 p-8 rounded-xl mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-center text-foreground font-medium mb-6 text-lg">
                  Soyez parmi les premiers à essayer Neural Booster !
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className="border border-primary/30 rounded-lg px-4 py-3 w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium whitespace-nowrap">
                    M'avertir au lancement
                  </button>
                </div>
              </motion.form>
              
              <motion.div 
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-foreground/70 text-center mb-6 font-medium">Bientôt disponible sur :</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <motion.a 
                    href="#" 
                    className="store-badge flex items-center gap-3 bg-foreground text-white py-3 px-5 rounded-xl hover:bg-foreground/80 transition-colors"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#ffffff" fill="none">
                        <line x1="24.03" y1="39.07" x2="22.37" y2="41.97" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="34.86" y1="20.12" x2="26.05" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="34.19" y1="28.31" x2="42.17" y2="41.97" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="29.39" y1="20.12" x2="32.16" y2="24.84" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="19.54" y1="35.53" x2="34.39" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="44.71" y1="35.53" x2="38.41" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="10.23" y="10.23" width="43.55" height="43.55" rx="10.31" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs leading-tight">Télécharger sur</p>
                      <p className="text-lg font-medium leading-tight">App Store</p>
                    </div>
                  </motion.a>
                  
                  <motion.a 
                    href="#" 
                    className="store-badge flex items-center gap-3 bg-foreground text-white py-3 px-5 rounded-xl hover:bg-foreground/80 transition-colors"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 210 210" fill="#ffffff">
                        <path d="M190.32,90.03L36.784,2.266C34.137,0.754,31.19,0,28.243,0c-0.06,0-0.119,0.008-0.178,0.008
                        c-0.396,0.004-0.791,0.024-1.185,0.055c-0.178,0.014-0.355,0.033-0.533,0.053c-0.308,0.034-0.615,0.077-0.921,0.128
                        c-0.111,0.019-0.223,0.025-0.334,0.046l0.006,0.008c-1.913,0.353-3.78,1.027-5.515,2.034c-5.314,3.083-8.585,8.762-8.585,14.905
                        v175.527c0,6.143,3.271,11.822,8.585,14.905c1.734,1.007,3.601,1.682,5.514,2.035l-0.005,0.007c0.1,0.019,0.201,0.025,0.3,0.041
                        c0.329,0.056,0.659,0.102,0.99,0.137c0.166,0.018,0.331,0.036,0.497,0.049c0.389,0.031,0.777,0.049,1.167,0.054
                        c0.066,0.001,0.131,0.009,0.197,0.009c2.947,0,5.894-0.754,8.541-2.266L190.32,119.97c5.368-3.069,8.681-8.777,8.681-14.962
                        c0,0,0-0.003,0-0.004c0,0,0-0.003,0-0.004c0,0,0-0.003,0-0.004c0,0,0-0.003,0-0.004C199.001,98.808,195.688,93.1,190.32,90.03z
                        M129.602,72.601l-15.266,20.027L75.496,41.672L129.602,72.601z M182.876,106.947l-107.38,61.381l67.234-88.206l40.145,22.947
                        c0.695,0.397,1.127,1.141,1.127,1.938C184.001,105.807,183.569,106.551,182.876,106.947z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs leading-tight">Disponible sur</p>
                      <p className="text-lg font-medium leading-tight">Google Play</p>
                    </div>
                  </motion.a>
                </div>
              </motion.div>
              
              <div className="text-center text-foreground/60 text-sm mt-12">
                © {new Date().getFullYear()} Neural Booster. Tous droits réservés.
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Navigation fixe */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ opacity: 1 }}
      >
        {[0, 1, 2, 3].map(index => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${activeSection === index ? 'bg-primary scale-125' : 'bg-primary/40'}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </motion.div>
    </div>
  );
}

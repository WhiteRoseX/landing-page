'use client'

import { useRef, useEffect, useState, useCallback } from "react";
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
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import UserIcon from '@heroicons/react/24/solid';

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
// Ajouter les imports d'authentification
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUwRJ-i_Rus0w1GBtHdtSuhFw5OkLzpwE",
  authDomain: "stockeremail-landingpage.firebaseapp.com",
  projectId: "stockeremail-landingpage",
  storageBucket: "stockeremail-landingpage.firebasestorage.app",
  messagingSenderId: "659462249357",
  appId: "1:659462249357:web:ba846cde3fa82ffa62fbc4",
  measurementId: "G-0M93LJRPEM"
};

// Initialiser Firebase côté client uniquement
let app: any;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let auth: any;

// Log pour le débogage de l'initialisation
if (typeof window !== 'undefined') {
  try {
    console.log("Initialisation de Firebase...");
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    analytics = getAnalytics(app);
    auth = getAuth(app);
    
    // Connexion anonyme pour résoudre les problèmes de permissions
    signInAnonymously(auth)
      .then(() => {
        console.log("Authentification anonyme réussie");
      })
      .catch((error) => {
        console.error("Erreur d'authentification anonyme:", error);
      });
      
    console.log("Firebase initialisé avec succès", { 
      appInitialized: !!app,
      dbInitialized: !!db,
      authInitialized: !!auth
    });
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
  }
}

// Ajouter les traductions
const translations = {
  fr: {
    boostBrain: "Boostez votre cerveau en 5 min par jour",
    miniGames: "Des mini-jeux pour stimuler vos capacités cognitives.",
    scienceBehind: "La science derrière Neural Booster",
    studiesProve: "Des études scientifiques prouvent l&#39;efficacité des jeux cognitifs",
    brainTraining: "L&#39;entraînement cérébral validé scientifiquement",
    studyPublished: "Une étude publiée dans le",
    journalName: "Journal of Cognitive Enhancement",
    studyYear: "(2023) a démontré que seulement 5 minutes d&#39;entraînement quotidien avec des mini-jeux cognitifs améliorent significativement :",
    workingMemory: "La mémoire de travail de 26% en moyenne après 6 semaines",
    processingSpeed: "La vitesse de traitement cognitif de 19% après seulement 1 mois",
    concentrationCapacity: "La capacité de concentration soutenue de 31% après 2 mois",
    scienceQuote: "\"Les mini-jeux cognitifs comme ceux de Neural Booster représentent une méthode efficace et scientifiquement validée pour améliorer la plasticité cérébrale à tout âge.\"",
    scientistName: "— Dr. Sarah Roberts, Neuroscientifique",
    betaFeedback: "Retours de nos bêta-testeurs",
    honestOpinions: "Des avis honnêtes de personnes qui ont testé la version bêta",
    medStudent: "Étudiante en médecine",
    weeks: "semaines",
    month: "mois",
    testimonial1: "\"On m&#39;a présenté l&#39;application pendant ma période d&#39;examen. Au lieu de regarder Insta pendant mes pauses de révisions, je faisais les mini-jeux et ça me permettait de souffler sans trop perturber mon cerveau. Les jeux sont vraiment cool et intuitifs. Pour une première version, c&#39;est impressionnant.\"",
    testimonial2: "\"L&#39;application a un bon potentiel. Les designs sont modernes et agréables à utiliser. Après l&#39;avoir utilisée de temps en temps et pendant mes pauses, je me sentais stimulé positivement. Comme toute app, elle peut s&#39;améliorer avec le temps, mais pour une première version c&#39;est solide et en plus c&#39;est gratuit.\"",
    computerSpecialist: "Informaticien, 38 ans",
    transformCreativity: "Transformez votre créativité avec",
    beAmongFirst: "Soyez parmi les premiers à essayer Neural Booster !",
    emailPlaceholder: "Votre adresse email",
    notifyLaunch: "M&#39;avertir au lancement",
    sending: "Envoi...",
    thankYou: "Merci ! Votre email a bien été enregistré.",
    awesome: "Génial !",
    downloadOn: "Télécharger sur",
    availableOn: "Disponible sur",
    allRightsReserved: "Tous droits réservés.",
    errorOccurred: "Une erreur est survenue. Votre email a été enregistré localement.",
    comingSoon: "Bientôt disponible sur :",
    transparencyNote: "Avis de nos bêta-testeurs sur l&#39;expérience Neural Booster. Nous améliorons continuellement l&#39;application grâce à vos retours !",
    cognitiveEnhancement: "Amélioration des fonctions cognitives sur 8 semaines",
    memory: "Mémoire",
    concentration: "Concentration",
    logic: "Logique",
    week: "S",
    score: "Score cognitif",
    basedOn: "*Basé sur une étude de 2023 avec 5 min d&#39;entraînement quotidien",
    scrollToDiscover: "Défiler pour découvrir"
  },
  en: {
    boostBrain: "Boost your brain in 5 min per day",
    miniGames: "Mini-games to stimulate your cognitive abilities.",
    scienceBehind: "The science behind Neural Booster",
    studiesProve: "Scientific studies prove the effectiveness of cognitive games",
    brainTraining: "Scientifically validated brain training",
    studyPublished: "A study published in the",
    journalName: "Journal of Cognitive Enhancement",
    studyYear: "(2023) demonstrated that just 5 minutes of daily training with cognitive mini-games significantly improve:",
    workingMemory: "Working memory by 26% on average after 6 weeks",
    processingSpeed: "Cognitive processing speed by 19% after just 1 month",
    concentrationCapacity: "Sustained concentration capacity by 31% after 2 months",
    scienceQuote: "\"Cognitive mini-games like those in Neural Booster represent an effective and scientifically validated method to improve brain plasticity at any age.\"",
    scientistName: "— Dr. Sarah Roberts, Neuroscientist",
    betaFeedback: "Feedback from our beta testers",
    honestOpinions: "Honest opinions from people who tested the beta version",
    medStudent: "Medical student",
    weeks: "weeks",
    month: "month",
    testimonial1: "\"I was introduced to the app during my exam period. Instead of scrolling through Instagram during my study breaks, I played the mini-games and it allowed me to relax without disrupting my brain. The games are really cool and intuitive. For a first version, it&#39;s impressive.\"",
    testimonial2: "\"The app has good potential. The designs are modern and pleasant to use. After using it occasionally and during my breaks, I felt positively stimulated. Like any app, it can improve over time, but for a first version it&#39;s solid and it&#39;s free too.\"",
    computerSpecialist: "IT specialist, 38 years old",
    transformCreativity: "Transform your creativity with",
    beAmongFirst: "Be among the first to try Neural Booster!",
    emailPlaceholder: "Your email address",
    notifyLaunch: "Notify me at launch",
    sending: "Sending...",
    thankYou: "Thank you! Your email has been registered.",
    awesome: "Awesome!",
    downloadOn: "Download on",
    availableOn: "Available on",
    allRightsReserved: "All rights reserved.",
    errorOccurred: "An error occurred. Your email has been saved locally.",
    comingSoon: "Coming soon on:",
    transparencyNote: "Reviews from our beta testers on the Neural Booster experience. We continuously improve the app based on your feedback!",
    cognitiveEnhancement: "Cognitive function improvement over 8 weeks",
    memory: "Memory",
    concentration: "Concentration",
    logic: "Logic",
    week: "W",
    score: "Cognitive score",
    basedOn: "*Based on a 2023 study with 5 min of daily training",
    scrollToDiscover: "Scroll to discover"
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  
  const [activeSection, setActiveSection] = useState(0);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const t = translations[language];
  
  // Données pour les graphiques
  const progressData = [
    { name: language === 'fr' ? 'Jour 1' : 'Day 1', value: 10 },
    { name: language === 'fr' ? 'Jour 7' : 'Day 7', value: 25 },
    { name: language === 'fr' ? 'Jour 14' : 'Day 14', value: 40 },
    { name: language === 'fr' ? 'Jour 30' : 'Day 30', value: 65 },
    { name: language === 'fr' ? 'Jour 60' : 'Day 60', value: 90 },
  ];
  
  const skillsData = [
    { name: language === 'fr' ? 'Mémoire' : 'Memory', value: 80, fill: '#4361ee' },
    { name: language === 'fr' ? 'Logique' : 'Logic', value: 75, fill: '#3f37c9' },
    { name: language === 'fr' ? 'Créativité' : 'Creativity', value: 85, fill: '#3a0ca3' },
    { name: language === 'fr' ? 'Concentration' : 'Focus', value: 70, fill: '#7209b7' },
  ];
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Pour le formulaire et ses animations
  const [typingEffect, setTypingEffect] = useState(false);
  const [showEinstein, setShowEinstein] = useState(false);
  
  // Log pour vérifier l'état de Firebase au rendu du composant
  useEffect(() => {
    console.log("État de Firebase au chargement:", {
      appInitialized: !!app,
      dbInitialized: !!db,
      authInitialized: !!auth,
      windowDefined: typeof window !== 'undefined'
    });
  }, []);
  
  // Fonction pour sauvegarder en local
  const saveEmailLocally = (email: string) => {
    try {
      if (typeof window !== 'undefined') {
        // Récupérer les emails existants
        const storedEmails = localStorage.getItem('neuralbooster_emails');
        let emails = [];
        
        if (storedEmails) {
          emails = JSON.parse(storedEmails);
        }
        
        // Ajouter le nouvel email avec timestamp
        emails.push({
          email,
          date: new Date().toISOString(),
        });
        
        // Sauvegarder dans localStorage
        localStorage.setItem('neuralbooster_emails', JSON.stringify(emails));
        console.log("Email sauvegardé en local");
        
        return true;
      }
    } catch (error) {
      console.error("Erreur de sauvegarde locale:", error);
    }
    return false;
  };

  // Réinitialiser l'animation Einstein après un certain temps
  useEffect(() => {
    if (showEinstein) {
      const timer = setTimeout(() => {
        setShowEinstein(false);
      }, 5000); // Afficher pendant 5 secondes
      
      return () => clearTimeout(timer);
    }
  }, [showEinstein]);

  // Fonction pour soumettre l'email complète avec Firebase
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulaire soumis avec email:", email);
    
    // Validation simple
    if (!email || !email.includes('@')) {
      console.log("Email invalide");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowEinstein(false); // Réinitialiser Einstein
    
    try {
      let firebaseSuccess = false;
      
      // 1. Vérifier l'état de l'authentification
      if (typeof window !== 'undefined' && auth && db) {
        // Vérifier que l'utilisateur est authentifié
        const user = auth.currentUser;
        
        console.log("État de l'authentification:", {
          authentifié: !!user,
          userId: user?.uid
        });
        
        // Si pas authentifié, essayer de s'authentifier anonymement
        if (!user) {
          console.log("Tentative d'authentification anonyme...");
          try {
            await signInAnonymously(auth);
            console.log("Authentification anonyme réussie pendant la soumission");
          } catch (authError) {
            console.error("Échec d'authentification pendant la soumission:", authError);
          }
        }
        
        // 2. Essayer d'enregistrer dans Firebase
        console.log("Tentative d'ajout à Firebase...", {
          dbExists: !!db,
          userAuthenticated: !!auth.currentUser,
          firestoreAvailable: typeof collection === 'function',
          addDocAvailable: typeof addDoc === 'function'
        });
        
        try {
          // Créer la collection si elle n'existe pas
          const emailsCollection = collection(db, "emails");
          console.log("Collection créée/récupérée:", !!emailsCollection);
          
          const docRef = await addDoc(emailsCollection, {
            email,
            date: new Date().toISOString(),
            source: 'landing_page',
            userId: auth.currentUser?.uid || 'non_authentifié',
            userAgent: navigator.userAgent
          });
          console.log("Email ajouté avec succès à Firebase, ID:", docRef.id);
          firebaseSuccess = true;
        } catch (fbError) {
          console.error("Erreur détaillée lors de l'ajout à Firebase:", {
            error: fbError,
            message: fbError instanceof Error ? fbError.message : 'Unknown error',
            code: (fbError as any)?.code,
            name: fbError instanceof Error ? fbError.name : 'Unknown'
          });
          // Continue vers localStorage
        }
      } else {
        console.warn("Firebase non disponible:", {
          window: typeof window,
          auth: !!auth,
          db: !!db
        });
      }
      
      // 2. Toujours sauvegarder en local (double backup)
      let localSuccess = false;
      try {
        if (typeof window !== 'undefined') {
          const storedEmails = localStorage.getItem('neuralbooster_emails') || '[]';
          const emails = JSON.parse(storedEmails);
          
          emails.push({
            email,
            date: new Date().toISOString(),
            firebaseSync: firebaseSuccess
          });
          
          localStorage.setItem('neuralbooster_emails', JSON.stringify(emails));
          console.log("Email sauvegardé en local avec succès");
          localSuccess = true;
        }
      } catch (localError) {
        console.error("Erreur localStorage:", localError);
      }
      
      // Si au moins une des méthodes a fonctionné
      if (firebaseSuccess || localSuccess) {
        console.log("Enregistrement réussi");
        setSubmitStatus('success');
        setEmail('');
        setShowEinstein(true); // Afficher Einstein lors du succès
      } else {
        throw new Error("Échec de l'enregistrement de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSubmitStatus('error');
    } finally {
      console.log("Finalisation du traitement");
      setIsSubmitting(false);
    }
  };
  
  // Ajouter un effet pour éviter un état de chargement infini
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Si le formulaire est en cours de soumission, mettre un timeout de sécurité
    if (isSubmitting) {
      timeoutId = setTimeout(() => {
        console.log("Timeout de sécurité déclenché");
        setIsSubmitting(false);
        setSubmitStatus('error');
      }, 10000); // 10 secondes max pour la soumission
    }
    
    // Nettoyage du timeout
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSubmitting]);
  
  // Détection de la section active
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const scrollPosition = window.scrollY + window.innerHeight / 2;
          const sections = [section1Ref, section2Ref, section3Ref];
          
          // Déterminer quelle section est active en fonction de la position de défilement
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i].current;
            if (section) {
              const sectionTop = section.offsetTop;
              const sectionBottom = sectionTop + section.offsetHeight;
              
              if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                setActiveSection(i);
                break;
              } else if (i === sections.length - 1 && scrollPosition >= sectionBottom) {
                setActiveSection(i + 1);
              }
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Exécuter une fois au chargement initial
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation entre sections
  const scrollToSection = useCallback((index: number) => {
    const sections = [section1Ref, section2Ref, section3Ref];
    if (sections[index]?.current) {
      window.scrollTo({
        top: sections[index].current!.offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);
  
  // Fonction pour faire défiler jusqu'à la section suivante
  const scrollToNextSection = useCallback(() => {
    if (section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section2Ref]);
  
  // Mettre à jour les données de graphique lors du changement de langue
  const chartData = [
    { semaine: language === 'fr' ? 'S0' : 'W0', mémoire: 40, concentration: 35, logique: 30 },
    { semaine: language === 'fr' ? 'S1' : 'W1', mémoire: 45, concentration: 38, logique: 34 },
    { semaine: language === 'fr' ? 'S2' : 'W2', mémoire: 52, concentration: 42, logique: 40 },
    { semaine: language === 'fr' ? 'S3' : 'W3', mémoire: 58, concentration: 48, logique: 45 },
    { semaine: language === 'fr' ? 'S4' : 'W4', mémoire: 64, concentration: 55, logique: 52 },
    { semaine: language === 'fr' ? 'S6' : 'W6', mémoire: 75, concentration: 67, logique: 64 },
    { semaine: language === 'fr' ? 'S8' : 'W8', mémoire: 85, concentration: 78, logique: 72 },
  ];
  
  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-white">
      {/* Section 1: Intro */}
      <section 
        ref={section1Ref}
        id="section-1"
        className="min-h-screen w-full flex items-center justify-center bg-white relative motion-section"
      >
        {/* Lien X discret mais plus visible et centré */}
        <motion.a
          href="https://x.com/lucasdjavid"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-primary/10 text-foreground/80 hover:text-primary hover:bg-white hover:border-primary/30 transition-all z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-medium">@lucasdjavid</span>
        </motion.a>
        
        {/* Sélecteur de langue */}
        <motion.div
          className="absolute top-10 right-10 flex items-center gap-3 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.button
            className={`w-10 h-8 rounded-sm overflow-hidden ${language === "fr" ? 'border-2 border-white shadow-lg scale-110' : 'border-2 border-white/40 shadow-md opacity-70'} flex items-center justify-center transition-all cursor-pointer`}
            whileHover={{ 
              scale: 1.1, 
              borderColor: 'rgba(255,255,255,1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: 1
            }}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            onClick={() => setLanguage("fr")}
          >
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 flex flex-row">
                <div className="flex-1 bg-[#002395]"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-[#ED2939]"></div>
              </div>
            </div>
          </motion.button>
          
          <motion.button
            className={`w-10 h-8 rounded-sm overflow-hidden ${language === "en" ? 'border-2 border-white shadow-lg scale-110' : 'border-2 border-white/40 shadow-md opacity-70'} flex items-center justify-center transition-all cursor-pointer`}
            whileHover={{ 
              scale: 1.1,
              borderColor: 'rgba(255,255,255,0.7)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: 1
            }}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            onClick={() => setLanguage("en")}
          >
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-full h-full">
                  <clipPath id="s">
                    <path d="M0,0 v30 h60 v-30 z"/>
                  </clipPath>
                  <clipPath id="t">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                  </clipPath>
                  <g clipPath="url(#s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                  </g>
                </svg>
              </div>
            </div>
          </motion.button>
        </motion.div>
        
        <div className="w-full h-full flex items-center justify-center">
          <IntroAnimation />
          
          {/* Texte "Défiler pour découvrir" amélioré avec comportement de clic */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            onClick={scrollToNextSection}
            whileHover={{ scale: 1.1, opacity: 1 }}
          >
            <p className="text-foreground/70 mb-2 text-sm font-medium">{t.scrollToDiscover}</p>
            <motion.div
              className="w-5 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-1"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            >
              <motion.div
                className="w-1.5 h-3 bg-primary rounded-full"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              />
            </motion.div>
            <ChevronDownIcon className="w-6 h-6 text-primary animate-bounce mt-2" />
          </motion.div>
        </div>
      </section>
      
      {/* Section 2: Graphiques */}
      <section 
        ref={section2Ref}
        id="section-2"
        className="min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-b from-white to-[#f0f4ff] relative py-12 motion-section"
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
                {t.boostBrain}
              </h2>
            </div>
            <p className="text-xl md:text-xl text-foreground/80 max-w-3xl mx-auto">
              {t.miniGames}
            </p>
          </motion.div>
          
          {/* Écrans de l'application */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-16 max-w-5xl mx-auto relative">
            {/* Éléments visuels de jeux vidéo autour des écrans */}
            {/* Logo App Store flottant */}
            <motion.div
              className="absolute -left-20 top-0 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: [0.9, 1.05, 0.9],
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
            >
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#4361ee" fill="none" className="w-10 h-10">
                <line x1="24.03" y1="39.07" x2="22.37" y2="41.97" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="34.86" y1="20.12" x2="26.05" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="34.19" y1="28.31" x2="42.17" y2="41.97" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="29.39" y1="20.12" x2="32.16" y2="24.84" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="19.54" y1="35.53" x2="34.39" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="44.71" y1="35.53" x2="38.41" y2="35.53" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="10.23" y="10.23" width="43.55" height="43.55" rx="10.31" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            
            {/* Logo Play Store flottant */}
            <motion.div
              className="absolute -right-16 top-20 w-14 h-14 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: [0.95, 1.1, 0.95],
                y: [0, 15, 0],
                rotate: [3, -3, 3],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
            >
              <svg viewBox="0 0 210 210" fill="#3a0ca3" className="w-9 h-9">
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
            </motion.div>
            
            {/* Score de jeu qui augmente */}
            <motion.div
              className="absolute left-[40%] -top-10 bg-gradient-to-br from-primary/80 to-secondary/80 text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.1, 1.1, 0.8],
                x: [-20, 0, 0, 20],
                y: [0, -15, -15, -30]
              }}
              transition={{
                duration: 2,
                times: [0, 0.2, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              +125 pts
            </motion.div>
            
            <motion.div
              className="absolute right-[30%] bottom-0 bg-gradient-to-br from-secondary/80 to-primary/80 text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.1, 1.1, 0.8],
                x: [20, 0, 0, -20],
                y: [0, -15, -15, -30]
              }}
              transition={{
                duration: 2,
                times: [0, 0.2, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 4,
                delay: 1.5
              }}
            >
              +200 pts
            </motion.div>
            
            {/* Combo ou Multiplier */}
            <motion.div
              className="absolute top-1/3 right-0 bg-yellow-400/90 text-black font-extrabold px-4 py-1 rounded-full shadow-lg text-sm"
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1.2, 0.8],
                y: [0, -10, -10, -25]
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity,
                repeatDelay: 5,
                delay: 3
              }}
            >
              COMBO x3!
            </motion.div>

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
        className="min-h-[90vh] w-full flex items-center justify-center bg-[#f0f4ff] relative py-12 motion-section"
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
                {t.scienceBehind}
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
              {t.studiesProve}
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
                  {t.cognitiveEnhancement}
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
                      data={chartData}
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
                        tickFormatter={(value) => value.replace('S', t.week)}
                      />
                      <YAxis 
                        tickCount={6} 
                        domain={[0, 100]} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        label={{ value: t.score, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: '#666' } }}
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
                            { label: t.memory, color: "#4361ee", delay: 0.6 },
                            { label: t.concentration, color: "#7209b7", delay: 0.8 },
                            { label: t.logic, color: "#3a0ca3", delay: 1.0 }
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
                  <span>{t.basedOn}</span>
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
                {t.brainTraining}
              </motion.h3>
              <div className="space-y-6 text-foreground/80">
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {t.studyPublished} <motion.span 
                    className="font-semibold" 
                    whileHover={{ 
                      color: "#4361ee",
                      transition: { duration: 0.2 }
                    }}
                  >{t.journalName}</motion.span> ({t.studyYear}
                </motion.p>
                <ul className="space-y-4">
                  {[
                    { text: t.workingMemory, color: "#4361ee" },
                    { text: t.processingSpeed, color: "#3a0ca3" },
                    { text: t.concentrationCapacity, color: "#7209b7" },
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
                    {t.scienceQuote}
                    <motion.span 
                      className="block text-sm mt-2 font-semibold"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.4 }}
                      viewport={{ once: true }}
                    >
                      {t.scientistName}
                    </motion.span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Nouvelle section: Témoignages */}
      <section 
        id="section-testimonials"
        className="min-h-[85vh] w-full flex items-center justify-center bg-[#f7faff] relative py-12 motion-section"
      >
        <div className="max-w-6xl px-8 py-16 w-full">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-xl md:text-4xl font-bold px-6 py-4 mb-4 text-foreground relative">
              <span className="relative">
                {t.betaFeedback}
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
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
              {t.honestOpinions}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Témoignage 1 */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(67, 97, 238, 0.1), 0 10px 10px -5px rgba(67, 97, 238, 0.04)"
              }}
            >
              {/* Éléments décoratifs */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full"></div>
              <div className="absolute top-1/2 -right-6 w-16 h-16 bg-secondary/10 rounded-full"></div>
              <div className="absolute -bottom-8 left-1/3 w-20 h-20 bg-primary/5 rounded-full"></div>
              
              {/* Guillemets décoratifs */}
              <div className="absolute top-6 left-6 text-6xl text-primary/10 font-serif leading-none">
                "
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-neutral-100">
                    <svg className="w-full h-full text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t.medStudent}</h3>
                    <p className="text-foreground/60 text-sm">{language === "fr" ? `Il y a 3 ${t.weeks}` : `3 ${t.weeks} ago`}</p>
                  </div>
                </div>
                
                <p className="text-foreground/80 italic mb-4">
                  {t.testimonial1}
                </p>
                
                <div className="flex items-center mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-foreground/60 text-sm">{language === "fr" ? `Il y a 3 ${t.weeks}` : `3 ${t.weeks} ago`}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Témoignage 2 */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(67, 97, 238, 0.1), 0 10px 10px -5px rgba(67, 97, 238, 0.04)"
              }}
            >
              {/* Éléments décoratifs */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-secondary/10 rounded-full"></div>
              <div className="absolute top-1/2 -left-6 w-16 h-16 bg-primary/10 rounded-full"></div>
              <div className="absolute -bottom-8 right-1/3 w-20 h-20 bg-secondary/5 rounded-full"></div>
              
              {/* Guillemets décoratifs */}
              <div className="absolute top-6 left-6 text-6xl text-primary/10 font-serif leading-none">
                "
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-neutral-100">
                    <svg className="w-full h-full text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Marc D.</h3>
                    <p className="text-foreground/60 text-sm">{t.computerSpecialist}</p>
                  </div>
                </div>
                
                <p className="text-foreground/80 italic mb-4">
                  {t.testimonial2}
                </p>
                
                <div className="flex items-center mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-foreground/60 text-sm">{language === "fr" ? "Il y a 1 mois" : "1 month ago"}</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Note de transparence */}
          <motion.div 
            className="mt-16 max-w-2xl mx-auto text-center bg-white/50 backdrop-blur-sm p-4 rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <p className="text-sm text-foreground/70">
              {t.transparencyNote}
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Section 3: Formulaire */}
      <section 
        ref={section3Ref}
        id="section-3"
        className="min-h-[85vh] w-full flex items-center justify-center bg-[#f0f4ff] relative py-12 motion-section"
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
                {t.transformCreativity} <span className="text-primary">Neural Booster</span>
              </h3>
              
              <motion.form 
                className="bg-primary/5 p-8 rounded-xl mb-12 max-w-2xl mx-auto relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                onSubmit={handleSubmitEmail}
              >
                <p className="text-center text-foreground font-medium mb-6 text-lg">
                  {t.beAmongFirst}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div 
                    className="relative sm:flex-1"
                    animate={{ 
                      scale: typingEffect ? [1, 1.02, 1] : 1,
                      boxShadow: typingEffect ? ["0 0 0px rgba(67,97,238,0)", "0 0 8px rgba(67,97,238,0.3)", "0 0 0px rgba(67,97,238,0)"] : "none"
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <motion.input 
                    type="email" 
                    placeholder={t.emailPlaceholder} 
                      className="border border-primary/30 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setTypingEffect(true);
                        setTimeout(() => setTypingEffect(false), 1000);
                      }}
                      required
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />
                    {email && (
                      <motion.div 
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-primary"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        {email.includes('@') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.button 
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium whitespace-nowrap disabled:opacity-70"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t.sending}</span>
                </div>
                    ) : t.notifyLaunch}
                  </motion.button>
                </div>
                
                {/* Messages de succès/erreur */}
                {submitStatus === 'success' && (
                  <motion.div 
                    className="mt-4 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.p 
                      className="text-green-600 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {t.thankYou}
                    </motion.p>
                    
                    {/* Animation Einstein */}
                    {showEinstein && (
                      <motion.div 
                        className="relative mx-auto max-w-[150px] mt-4"
                        initial={{ opacity: 0, scale: 0, rotate: -10 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          rotate: 0,
                          y: [0, -10, 0, -5, 0],
                        }}
                        transition={{ 
                          duration: 0.8, 
                          y: { 
                            duration: 2, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                          }
                        }}
                      >
                        <img 
                          src="/einstein.png" 
                          alt="Einstein" 
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                        <motion.div 
                          className="absolute -top-6 -right-4 transform rotate-12 bg-white text-primary px-3 py-1 rounded-lg shadow-md text-sm font-bold"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          {t.awesome}
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.p 
                    className="text-red-600 mt-4 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {t.errorOccurred}
                  </motion.p>
                )}
              </motion.form>
              
              <motion.div 
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="text-foreground/70 text-center mb-6 font-medium">{t.comingSoon}</p>
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
                      <p className="text-xs leading-tight">{t.downloadOn}</p>
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
                      <p className="text-xs leading-tight">{t.availableOn}</p>
                      <p className="text-lg font-medium leading-tight">Google Play</p>
                    </div>
                  </motion.a>
                </div>
              </motion.div>
              
              <div className="text-center text-foreground/60 text-sm mt-12">
                © {new Date().getFullYear()} Neural Booster. {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
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

// frontend/src/pages/NotFound.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringEmoji, setIsHoveringEmoji] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [visibleText, setVisibleText] = useState("");
  const fullText = "The page you're looking for seems to have vanished like last season's trends.";
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);
  
  // Background particle refs
  const particlesRef = useRef(null);
  const particles = useRef([]);
  const particleCount = 20;
  
  // Create motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform for different elements
  const titleX = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const titleY = useTransform(mouseY, [0, window.innerHeight], [-15, 15]);
  
  const dressX = useTransform(mouseX, [0, window.innerWidth], [-25, 25]);
  const dressY = useTransform(mouseY, [0, window.innerHeight], [-25, 25]);
  
  const particlesX = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);
  const particlesY = useTransform(mouseY, [0, window.innerHeight], [-5, 5]);
  
  // Animations control
  const buttonControls = useAnimation();
  const zeroControls = useAnimation();
  
  // Setup the typing effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setVisibleText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, []);
  
  // Setup the confetti effect
  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [showConfetti]);

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);
  
  // Setup mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      
      // Update mouse position for other effects
      setMousePosition({ 
        x: clientX / window.innerWidth - 0.5, 
        y: clientY / window.innerHeight - 0.5 
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);
  
  // Setup background particles
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // Initialize particles
    particles.current = Array(particleCount).fill().map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    const drawParticles = () => {
      const canvas = particlesRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.current.forEach(particle => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Loop particles if they go off screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 200, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(drawParticles);
    };
    
    drawParticles();
    
    // Pulse animation for the button
    buttonControls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
    
    // More elaborate animation for the zero
    zeroControls.start({
      rotateY: [0, 360],
      scale: [1, 1.2, 1],
      filter: [
        "drop-shadow(0 0 0 rgba(0, 0, 0, 0))",
        "drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))",
        "drop-shadow(0 0 0 rgba(0, 0, 0, 0))"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1
      }
    });
  }, [buttonControls, zeroControls]);
  
  // Clothing item icons for the floating background
  const fashionItems = [
    { icon: "👗", x: "10%", y: "15%", size: "3xl", delay: 0 },
    { icon: "👠", x: "85%", y: "20%", size: "2xl", delay: 0.5 },
    { icon: "👜", x: "75%", y: "70%", size: "3xl", delay: 1 },
    { icon: "👒", x: "15%", y: "75%", size: "2xl", delay: 1.5 },
    { icon: "🧣", x: "50%", y: "85%", size: "2xl", delay: 2 },
    { icon: "👚", x: "90%", y: "40%", size: "2xl", delay: 2.5 }
  ];
  
  // Create confetti particles
  const createConfetti = () => {
    return Array(100).fill().map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      rotation: Math.random() * 360,
      size: Math.random() * 10 + 5,
      color: ["#ff4d4d", "#ffcc00", "#9900cc", "#6666ff", "#66ccff"][Math.floor(Math.random() * 5)],
      duration: 1 + Math.random() * 3
    }));
  };

  // Page layout including all animations
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col" ref={containerRef}>
      {/* Navbar */}
      <Navbar />
      
      {/* Background animated canvas for particles */}
      <canvas 
        ref={particlesRef} 
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      />
      
      {/* Background fashion items */}
      <div className="absolute inset-0 z-0 overflow-hidden" ref={parallaxRef}>
        <motion.div style={{ x: particlesX, y: particlesY }} className="w-full h-full">
          {fashionItems.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute text-${item.size} opacity-5 z-0 pointer-events-none`}
              style={{ 
                left: item.x, 
                top: item.y,
                rotate: mousePosition.x * 10
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.05, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                delay: item.delay,
                y: {
                  repeat: Infinity,
                  duration: 4 + index,
                  repeatType: "reverse"
                },
                rotate: {
                  repeat: Infinity,
                  duration: 6 + index,
                  repeatType: "reverse"
                }
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {createConfetti().map(confetti => (
              <motion.div
                key={confetti.id}
                className="absolute z-30 rounded-full pointer-events-none"
                style={{
                  left: `${confetti.x}%`,
                  width: confetti.size,
                  height: confetti.size / 2,
                  backgroundColor: confetti.color,
                  rotate: confetti.rotation
                }}
                initial={{ y: confetti.y, opacity: 1 }}
                animate={{ 
                  y: window.innerHeight + 100,
                  opacity: [1, 1, 0],
                  rotate: confetti.rotation + 360 * (Math.random() > 0.5 ? 1 : -1)
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: confetti.duration, 
                  ease: [0.1, 0.4, 0.6, 1] 
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Main 404 content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-24 md:py-32 z-10 mt-[70px]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 with parallax and 3D effects */}
          <motion.div
            style={{ x: titleX, y: titleY }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 select-none"
          >
            <h1 className="text-7xl md:text-9xl font-light tracking-wider text-gray-900 flex justify-center items-center">
              <motion.span
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.1, color: "#ff6b6b" }}
              >
                4
              </motion.span>
              
              <motion.span
                className="inline-block relative"
                animate={zeroControls}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
                whileHover={{ 
                  scale: 1.5,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <span className="relative">
                  0
                  <motion.span
                    className="absolute inset-0 text-pink-500"
                    animate={{
                      opacity: [0, 0.5, 0],
                      x: [0, 4, 0],
                      y: [0, -2, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    0
                  </motion.span>
                </span>
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.1, color: "#ff6b6b" }}
              >
                4
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Glitching title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-thin tracking-wide text-gray-800 relative overflow-hidden">
              <span className="relative inline-block">
                <motion.span
                  className="inline-block"
                  animate={{ 
                    x: [0, -4, 0, 2, 0], 
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    repeatDelay: 5
                  }}
                >
                  P
                </motion.span>
                <motion.span
                  className="absolute top-0 left-0 text-pink-500 opacity-50"
                  animate={{ 
                    x: [0, 3, 0], 
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    repeatDelay: 5
                  }}
                >
                  P
                </motion.span>
              </span>
              age Not Found
            </h2>
          </motion.div>
          
          {/* Typewriter effect for text */}
          <motion.p 
            className="text-gray-600 mb-12 max-w-2xl mx-auto min-h-[50px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {visibleText}
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-[1em] bg-black ml-1 align-middle"
            />
          </motion.p>
          
          {/* Interactive fashion elements */}
          <div className="flex justify-center space-x-8 mb-12">
            {/* Animated dress */}
            <motion.div
              className="relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { rotate: { repeat: Infinity, duration: 0.5 } }
              }}
              onClick={() => setShowConfetti(true)}
            >
              <div className="text-5xl">👗</div>
              <motion.div
                className="absolute -bottom-7 left-0 right-0 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                Click me!
              </motion.div>
            </motion.div>
            
            {/* Animated hanger with "broken" effect */}
            <motion.div
              className="relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ 
                scale: 1.1,
              }}
              whileTap={{
                rotateZ: [0, 15, -15, 0],
                transition: { duration: 0.5 }
              }}
              onClick={() => {
                setIsHoveringEmoji(!isHoveringEmoji);
                setShowConfetti(true);
              }}
            >
              <motion.div 
                animate={isHoveringEmoji ? { 
                  rotateZ: [0, 20, -20, 0],
                  y: [0, -5, 0]
                } : {}}
                transition={{ 
                  duration: 0.8, 
                  repeat: isHoveringEmoji ? Infinity : 0 
                }}
                className="text-5xl"
              >
                👔
              </motion.div>
              <motion.div
                className="absolute -bottom-7 left-0 right-0 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                Tap me!
              </motion.div>
            </motion.div>
            
            {/* Animated shoe */}
            <motion.div
              className="relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              whileHover={{ 
                scale: 1.1,
                x: [0, -5, 5, 0],
                transition: { x: { repeat: Infinity, duration: 0.5 } }
              }}
              onClick={() => setShowConfetti(true)}
            >
              <div className="text-5xl">👠</div>
              <motion.div
                className="absolute -bottom-7 left-0 right-0 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                Click me!
              </motion.div>
            </motion.div>
          </div>
          
          {/* Auto-redirect info with animated countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-sm text-gray-500 mb-10"
          >
            Redirecting to home in{" "}
            <motion.span
              className="inline-block"
              key={countdown}
              initial={{ scale: 1.5, color: "#ff6b6b" }}
              animate={{ scale: 1, color: "#374151" }}
              transition={{ duration: 0.5 }}
            >
              {countdown}
            </motion.span>{" "}
            seconds...
          </motion.div>
          
          {/* Animated pulsing button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-16"
          >
            <motion.div
              animate={buttonControls}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/"
                className="px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors duration-300 inline-block"
                onClick={() => setShowConfetti(true)}
              >
                RETURN HOME
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Animated divider */}
          <motion.div 
            className="w-0 h-[1px] bg-gray-300 mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ delay: 1, duration: 0.8 }}
          />
          
          {/* Collection links with staggered appearance and hover effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { name: "Shop All", path: "/shop", delay: 0.4 },
              { name: "New Arrivals", path: "/collections/new-arrivals", delay: 0.5 },
              { name: "Dresses", path: "/shop/dresses", delay: 0.6 },
              { name: "Collections", path: "/collections", delay: 0.7 }
            ].map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: collection.delay,
                  duration: 0.5 
                }}
              >
                <Link 
                  to={collection.path}
                  className="block py-3 px-2 border border-gray-200 relative overflow-hidden group"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {collection.name}
                  </span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-black z-0 h-0"
                    initial={{ height: 0 }}
                    whileHover={{ height: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default NotFound;
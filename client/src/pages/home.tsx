import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hey, I'm MC, your personal Music Concierge. Ask me anything you need to know about Loop.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [joinButtonClicks, setJoinButtonClicks] = useState(0);
  const [isSecretCodeMode, setIsSecretCodeMode] = useState(false);
  const [secretCodeTimeout, setSecretCodeTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat suggestions
  const suggestions = [
    'What can Loop do for my release? ',
    'How does MC build a growth plan?',
    'What data does Loop analyze?',
    'Can Loop help with touring?'
  ];
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Hero dynamic phrases
  const heroPhrases = [
    'own success',
    'grow louder',
    'take control',
    'sell out shows',
    'move as one'
  ];
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);

  const toTitleCase = (input: string) => {
    return input.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Theme initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      let prefersDark = false;
      try {
        prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {}
      const useDark = stored ? stored === 'dark' : prefersDark || true;
      setIsDark(useDark);
      document.documentElement.classList.toggle('dark', useDark);
      document.documentElement.classList.toggle('light', !useDark);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  // Animation + interactivity initialization
  useEffect(() => {
    // Start pulsing animations
    const pulsingElements = document.querySelectorAll('.pulsing');
    pulsingElements.forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
    
    // Show gradient sphere after 1 second
    const sphereTimer = setTimeout(() => {
      const sphere = document.querySelector('.gradient-sphere') as HTMLElement;
      if (sphere) {
        sphere.style.opacity = '1';
      }
    }, 1000);
    
    // Show hero text after 7 seconds
    const textTimer = setTimeout(() => {
      const heroText = document.querySelector('.hero-text') as HTMLElement;
      if (heroText) {
        heroText.style.opacity = '1';
      }
    }, 7000);

    // Apple Liquid Glass interactive cursor tracking with throttling
    const chatContainer = chatContainerRef.current;
    let ticking = false;
    
    const updateMousePosition = (clientX: number, clientY: number) => {
      if (!chatContainer || ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        const { left, top, width, height } = chatContainer.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        
        // Clamp values between 0 and 1
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));
        
        chatContainer.style.setProperty('--mouse-x', clampedX.toString());
        chatContainer.style.setProperty('--mouse-y', clampedY.toString());
        
        ticking = false;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
      }
    };

    if (chatContainer) {
      chatContainer.addEventListener('mousemove', handleMouseMove);
      chatContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // Rotate chat suggestions auto
    const suggestionTimer = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % suggestions.length);
    }, 3500);

    // Rotate hero phrases every 2 seconds
    const heroPhraseTimer = setInterval(() => {
      setHeroPhraseIndex((i) => (i + 1) % heroPhrases.length);
    }, 2000);

    return () => {
      clearTimeout(sphereTimer);
      clearTimeout(textTimer);
      clearInterval(suggestionTimer);
      clearInterval(heroPhraseTimer);
      if (chatContainer) {
        chatContainer.removeEventListener('mousemove', handleMouseMove);
        chatContainer.removeEventListener('touchmove', handleTouchMove);
      }
      // Clear secret code timeout
      if (secretCodeTimeout) {
        clearTimeout(secretCodeTimeout);
      }
    };
  }, [secretCodeTimeout]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', { message: text.trim() });
      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleJoinButtonClick = () => {
    const newClickCount = joinButtonClicks + 1;
    setJoinButtonClicks(newClickCount);
    
    // Add click animation
    const joinButton = document.querySelector('.waitlist-button') as HTMLElement;
    if (joinButton) {
      joinButton.classList.add('clicked');
      setTimeout(() => {
        joinButton.classList.remove('clicked');
      }, 300);
    }
    
    if (newClickCount === 2) {
      // Toggle between secret code mode and normal waitlist mode
      setIsSecretCodeMode(!isSecretCodeMode);
      setJoinButtonClicks(0); // Reset click count
      
      // Clear any existing timeout
      if (secretCodeTimeout) {
        clearTimeout(secretCodeTimeout);
        setSecretCodeTimeout(null);
      }
      
      // Only set timeout if entering secret code mode
      if (!isSecretCodeMode) {
        // Auto-reset secret code mode after 30 seconds of inactivity
        const timeoutId = setTimeout(() => {
          setIsSecretCodeMode(false);
          setSecretCodeTimeout(null);
        }, 30000);
        
        setSecretCodeTimeout(timeoutId);
      }
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const input = String(formData.get('email') || '').trim();
    
    if (!input) return;
    
    if (isSecretCodeMode) {
      // Handle secret code submission
      console.log('Secret code entered:', input);
      // TODO: Redirect to login page when implemented
      alert('Secret code received! Login page coming soon.');
      setIsSecretCodeMode(false);
      
      // Clear timeout when exiting secret code mode
      if (secretCodeTimeout) {
        clearTimeout(secretCodeTimeout);
        setSecretCodeTimeout(null);
      }
      
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      // Handle normal email submission
      fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input })
      })
        .then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          (e.currentTarget as HTMLFormElement).reset();
          alert('Thanks! You\'re on the waitlist.');
        })
        .catch(() => {
          alert('There was a problem joining the waitlist. Please try again.');
        });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      {/* Site Header */}
      <header className="site-header" data-testid="site-header">
        <div className="header-left">
          <a className="logo" href="/" data-testid="logo-link">
            <img src="/assets/LoopIconNew.svg?v=2" alt="Loop Logo" data-testid="logo-image" />
          </a>
          <nav className="nav-links" data-testid="nav-links">
            <a className="btn" href="mailto:nick@loopdsp.com" data-testid="btn-contact">Contact</a>
            <a className="btn" href="https://instagram.com/loop_mp3" target="_blank" rel="noopener noreferrer" data-testid="btn-instagram">Instagram</a>
          </nav>
        </div>
        <form
          className={`waitlist-form ${isSecretCodeMode ? 'secret-code-mode' : ''}`}
          onSubmit={handleWaitlistSubmit}
        >
          <input
            type={isSecretCodeMode ? "text" : "email"}
            name="email"
            className="waitlist-input"
            placeholder={isSecretCodeMode ? "Enter Code" : "Join the waitlist"}
            aria-label={isSecretCodeMode ? "Secret code" : "Email address"}
            autoComplete={isSecretCodeMode ? "off" : "email"}
          />
          <button
            type="button"
            className="theme-toggle"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            data-testid="theme-toggle"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button 
            type="submit" 
            className="waitlist-button"
            onClick={handleJoinButtonClick}
          >
            Join
          </button>
        </form>
      </header>

      {/* Hero Loop Section */}
      <section className="hero-loop" data-testid="hero-loop">
        <div className="hero-loop-content">
          <span className="scroll" data-testid="loop-text">Loop</span>
        </div>
      </section>

      {/* Page Hero Section */}
      <section className="page-hero" data-testid="page-hero">
        <div className="animation-container" data-testid="animation-container">
          <div className="pulsing line-1" data-testid="pulsing-line-1"></div>
          <div className="pulsing line-2" data-testid="pulsing-line-2"></div>
          <div className="pulsing line-3" data-testid="pulsing-line-3"></div>
          <div className="gradient-sphere" data-testid="gradient-sphere"></div>
        </div>
        
        <div className="hero-text" data-testid="hero-text">
          <h1 className="headline" data-testid="headline">
            Where Artists<br />
            & Their Teams<br />
            <span className="highlight"><span
              key={heroPhraseIndex}
              className="dynamic-phrase dynamic-entry glitch"
              data-text={toTitleCase(heroPhrases[heroPhraseIndex])}
            >
              {toTitleCase(heroPhrases[heroPhraseIndex])}
            </span></span>
          </h1>
        </div>
        {/* Chat Container - Hidden for now */}
        {/* 
        <div ref={chatContainerRef} className="chat-container" data-testid="chat-container">
          <div className="chat-header" data-testid="chat-header">Ask MC</div>
          <div className="chat-messages" data-testid="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                data-testid={`message-${message.isUser ? 'user' : 'bot'}-${message.id}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message" data-testid="loading-message">
                <div className="loading" data-testid="loading-spinner"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-suggestions" data-testid="chat-suggestions">
            {suggestions.map((s, i) => (
              <button
                key={s}
                className={`suggestion ${i === suggestionIndex ? 'active' : ''}`}
                onClick={() => sendMessage(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSubmit} data-testid="chat-form">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What can Loop do for me?" 
              autoComplete="off"
              disabled={isLoading}
              data-testid="chat-input"
            />
            <button 
              type="submit" 
              className="chat-input-button"
              disabled={isLoading || !inputValue.trim()}
              data-testid="chat-submit"
            >
              Send
            </button>
          </form>
        </div>
        */}
      </section>

      {/* Site Footer */}
      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-stars" data-testid="footer-stars"></div>
        <p className="footer-text" data-testid="footer-text-2">
          All Rights Reserved, <span className="brand-name" data-testid="brand-name">Loop DSP, LLC</span>
        </p>
      </footer>
    </div>
  );
}

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
      text: "👋 Hi! I'm Loop's assistant. Ask me anything about Loop's features, pricing, or how to get started!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animation initialization
  useEffect(() => {
    // Start pulsing animations
    const pulsingElements = document.querySelectorAll('.pulsing');
    pulsingElements.forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
    
    // Show gradient sphere after 3 seconds
    const sphereTimer = setTimeout(() => {
      const sphere = document.querySelector('.gradient-sphere') as HTMLElement;
      if (sphere) {
        sphere.style.opacity = '1';
      }
    }, 3000);
    
    // Show hero text after 7 seconds
    const textTimer = setTimeout(() => {
      const heroText = document.querySelector('.hero-text') as HTMLElement;
      if (heroText) {
        heroText.style.opacity = '1';
      }
    }, 7000);

    return () => {
      clearTimeout(sphereTimer);
      clearTimeout(textTimer);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Site Header */}
      <header className="site-header" data-testid="site-header">
        <a className="logo" href="/" data-testid="logo-link">
          <img src="/assets/LoopIconNew.svg" alt="Loop Logo" data-testid="logo-image" />
        </a>
        <nav className="nav-links" data-testid="nav-links">
          <a className="btn" href="mailto:nick@loopdsp.com" data-testid="btn-contact">Contact</a>
          <a className="btn" href="https://instagram.com/loop_mp3" target="_blank" rel="noopener noreferrer" data-testid="btn-instagram">Instagram</a>
        </nav>
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
            The World's <span className="highlight"><i>First</i></span><br />
            Digital Music Manager
          </h1>
        </div>

        {/* Chat Container */}
        <div className="chat-container" data-testid="chat-container">
          <div className="chat-header" data-testid="chat-header">Ask Loop</div>
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
              disabled={isLoading || !inputValue.trim()}
              data-testid="chat-submit"
            >
              Send
            </button>
          </form>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-stars" data-testid="footer-stars"></div>
        <p className="footer-text" data-testid="footer-text-1">
          Investors please reach out at{' '}
          <a href="mailto:Nick@LoopDSP.com" data-testid="investor-email">Nick@LoopDSP.com</a>
        </p>
        <p className="footer-text" data-testid="footer-text-2">
          All Rights Reserved, <span className="brand-name" data-testid="brand-name">Loop DSP, LLC</span>
        </p>
      </footer>
    </div>
  );
}

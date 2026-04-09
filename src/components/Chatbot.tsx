import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Phone, Mail, ChevronRight, MessageSquare, X, Minus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Message = {
  id: string;
  text?: string;
  sender: 'bot' | 'user';
  type: 'text' | 'options' | 'form';
  options?: { label: string; value: string; action?: () => void }[];
};

const SERVICES = [
  { label: 'Book Online', value: 'book_online', redirect: 'https://booking.uk.hsone.app/soe/new/%20?pid=UKDME01' },
  { label: 'Dental Emergency', value: 'Dental Emergency' },
  { label: 'Dental Exam', value: 'Dental Exam' },
  { label: 'Dental Implants', value: 'Dental Implants' },
  { label: 'Invisalign', value: 'Invisalign' },
  { label: 'Composite Bonding', value: 'Composite Bonding' },
  { label: 'Facial Aesthetics', value: 'Facial Aesthetics' },
  { label: 'General Enquiry', value: 'General Enquiry' },
];

interface ChatbotProps {
  defaultOpen?: boolean;
  hideToggle?: boolean;
  isEmbedded?: boolean;
}

export default function Chatbot({ defaultOpen = false, hideToggle = false, isEmbedded = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
  });
  const [formStep, setFormStep] = useState<'name' | 'email' | 'phone' | 'done' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: Math.random().toString(36).substring(7) }]);
  };

  const startConversation = async () => {
    if (messages.length > 0) return;

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1000));
    addMessage({ text: "Hello 👋! Welcome to Studley Dental and Implant Clinic 🦷.", sender: 'bot', type: 'text' });
    
    await new Promise((r) => setTimeout(r, 1500));
    addMessage({ text: "Our aim is to provide the highest standard of private dentistry for the whole family.", sender: 'bot', type: 'text' });
    
    await new Promise((r) => setTimeout(r, 1500));
    addMessage({ text: "I'm Sara, here to help with your enquiry. Which of our services are you interested in today?", sender: 'bot', type: 'text' });
    
    setIsTyping(false);
    addMessage({
      sender: 'bot',
      type: 'options',
      options: SERVICES.map(s => ({
        label: s.label,
        value: s.value,
        action: () => handleServiceSelect(s)
      }))
    });
  };

  useEffect(() => {
    if (isOpen) {
      startConversation();
    }
  }, [isOpen]);

  const handleServiceSelect = (service: typeof SERVICES[0]) => {
    addMessage({ text: service.label, sender: 'user', type: 'text' });

    if (service.redirect) {
      addMessage({ text: "Redirecting you to our booking page...", sender: 'bot', type: 'text' });
      setTimeout(() => {
        window.open(service.redirect, '_blank');
      }, 1000);
      return;
    }

    setLeadData(prev => ({ ...prev, service: service.value }));
    setFormStep('name');
    
    setTimeout(() => {
      addMessage({ text: "Great! Could you please tell me your full name?", sender: 'bot', type: 'text' });
    }, 500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).elements.userInput.value;
    if (!input) return;

    addMessage({ text: input, sender: 'user', type: 'text' });
    (e.target as any).reset();

    if (formStep === 'name') {
      setLeadData(prev => ({ ...prev, name: input }));
      setFormStep('email');
      setTimeout(() => {
        addMessage({ text: `Thanks ${input.split(' ')[0]}! What is your email address?`, sender: 'bot', type: 'text' });
      }, 500);
    } else if (formStep === 'email') {
      setLeadData(prev => ({ ...prev, email: input }));
      setFormStep('phone');
      setTimeout(() => {
        addMessage({ text: "And finally, what is your phone number?", sender: 'bot', type: 'text' });
      }, 500);
    } else if (formStep === 'phone') {
      const finalData = { ...leadData, phone: input };
      setLeadData(finalData);
      setFormStep('done');
      
      setIsTyping(true);
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData),
        });
        
        await new Promise((r) => setTimeout(r, 1000));
        addMessage({ text: "Thank you! I've received your details. One of our team members will be in touch with you shortly.", sender: 'bot', type: 'text' });
      } catch (error) {
        console.error("Error submitting lead:", error);
        addMessage({ text: "Something went wrong, but don't worry, I've noted your interest. We'll try to reach out soon!", sender: 'bot', type: 'text' });
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!hideToggle && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-6 right-6 w-16 h-16 rounded-full bg-brand-primary text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50",
            isOpen && "rotate-90"
          )}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isEmbedded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "bg-[#1D1D1D] flex flex-col overflow-hidden z-50 border border-white/10",
              isEmbedded 
                ? "w-full h-full rounded-none" 
                : "fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] rounded-2xl shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="bg-brand-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                  S
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-tight">Sara</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Studley Dental & Implant clinic
                  </p>
                </div>
              </div>
              {!isEmbedded && (
                <div className="flex gap-2">
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Minus size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1D1D1D]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  {msg.type === 'text' && (
                    <motion.div
                      initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        msg.sender === 'user' 
                          ? "bg-slate-200 text-slate-800 rounded-tr-none" 
                          : "bg-[#64C4D1] text-white rounded-tl-none shadow-md"
                      )}
                    >
                      {msg.text}
                    </motion.div>
                  )}

                  {msg.type === 'options' && (
                    <div className="grid grid-cols-1 gap-2 w-full mt-2">
                      {msg.options?.map((opt, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={opt.action}
                          className="w-full text-left p-3 rounded-xl border border-white/10 bg-white hover:bg-white/90 text-[#1D1D1D] text-sm transition-all flex items-center justify-between group"
                        >
                          {opt.label}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-1 p-2 bg-white border border-slate-100 rounded-full w-12 justify-center">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1D1D1D] border-t border-white/10">
              {formStep && formStep !== 'done' ? (
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                  <input
                    name="userInput"
                    autoFocus
                    placeholder={
                      formStep === 'name' ? "Enter your name..." :
                      formStep === 'email' ? "Enter your email..." :
                      "Enter your phone number..."
                    }
                    className="flex-1 p-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </form>
              ) : (
                <p className="text-center text-xs text-slate-400 font-serif italic">
                  Studley Dental & Implant Clinic
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

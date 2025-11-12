import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { colors } from '../utils/theme';
import './AINoorScreen.css';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

const SYSTEM_PROMPT = `You are AI Noor, a knowledgeable and compassionate Islamic assistant. You help Muslims with:

1. Islamic knowledge and guidance
2. Prayer times and Qibla direction
3. Duas and supplications
4. Quranic verses and their meanings
5. Hadith and Sunnah
6. Tijaniyya Tariqa teachings
7. Islamic history and scholars
8. Spiritual guidance and advice

Always respond with:
- Islamic greetings (Assalamu alaikum, Barakallahu feeki, etc.)
- Authentic Islamic knowledge from Quran and Sunnah
- Gentle, respectful, and helpful tone
- Encouragement for good deeds
- Reminders about Allah's mercy and guidance
- When unsure, recommend consulting local scholars

Keep responses concise but informative, and always end with Islamic phrases like "May Allah guide us all" or "Barakallahu feeki".`;

const AINoorScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { t } = useLanguage();
  const { formatTime } = useTimeFormat();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      role: 'assistant', 
      content: 'Assalamu alaikum! I am AI Noor, your Islamic assistant. Ask me anything about Islam, prayer, Quran, Tijaniyya, or spiritual guidance. May Allah bless our conversation!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-send search query if provided
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setInput(searchQuery);
      // Auto-send the search query after a short delay
      setTimeout(() => {
        onSend();
      }, 500);
    }
  }, [searchQuery]);

  const callOpenAI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'I apologize, but I am experiencing technical difficulties. Please check your internet connection and try again. May Allah bless you!';
    }
  };

  const onSend = async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    const userMsg: Message = { 
      id: String(Date.now()), 
      role: 'user', 
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await callOpenAI(content, messages);
      const assistantMsg: Message = { 
        id: String(Date.now() + 1), 
        role: 'assistant', 
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        id: String(Date.now() + 1), 
        role: 'assistant', 
        content: 'I apologize for the error. Please try again. May Allah bless you!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="ai-noor-container">
      <div className="ai-noor-header">
        <h1 className="ai-noor-header-title">AI Noor</h1>
        <p className="ai-noor-header-subtitle">Your Islamic Assistant</p>
      </div>

      <div className="ai-noor-messages">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`ai-noor-bubble ${item.role === 'assistant' ? 'ai-noor-bubble-assistant' : 'ai-noor-bubble-user'}`}
          >
            {item.role === 'assistant' ? (
              <span className="ai-noor-icon">✨</span>
            ) : (
              <span className="ai-noor-icon">👤</span>
            )}
            <p className={item.role === 'assistant' ? 'ai-noor-text-assistant' : 'ai-noor-text-user'}>
              {item.content}
            </p>
            <span className="ai-noor-timestamp">
              {formatTime(item.timestamp)}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="ai-noor-loading-container">
            <div className="ai-noor-spinner"></div>
            <span className="ai-noor-loading-text">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-noor-composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Islam..."
          className="ai-noor-input"
          onKeyPress={handleKeyPress}
          rows={1}
          maxLength={500}
        />
        <button
          className={`ai-noor-send ${(!input.trim() || isLoading) ? 'ai-noor-send-disabled' : ''}`}
          onClick={onSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <div className="ai-noor-spinner-small"></div>
          ) : (
            <span>➤</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AINoorScreen;


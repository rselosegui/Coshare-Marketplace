const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const ChatView = \({ conversation, onBack }: { conversation: Conversation, onBack: \(\) => void }\) => {\n  const \[messageText, setMessageText\] = useState\(''\);/;

const replacement = `const ChatView = ({ conversation, onBack }: { conversation: Conversation, onBack: () => void }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      timestamp: 'Just now',
      type: 'text'
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: conversation.participantId || 'them',
        text: 'Thanks for the message. I will review and get back to you shortly!',
        timestamp: 'Just now',
        type: 'text'
      }]);
    }, 1500);
  };`;

content = content.replace(regex, replacement);

const mapRegex = /\{conversation\.messages\.map\(\(msg\) => \(/;
const mapReplacement = `{messages.map((msg) => (`;
content = content.replace(mapRegex, mapReplacement);

const inputRegex = /<input \n            type="text" \n            placeholder="Type a message\.\.\." \n            value=\{messageText\}\n            onChange=\{\(e\) => setMessageText\(e\.target\.value\)\}\n            className="flex-1 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none placeholder-gray-400"\n          \/>\n          <motion.button \n            whileTap=\{\{ scale: 0\.9 \}\}\n            className=\{\`ml-2 p-2 rounded-xl transition-all \$\{\n              messageText\.trim\(\) \? 'bg-accent text-white shadow-lg shadow-accent\/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'\n            \}\`\}\n          >\n            <ArrowUpRight className="w-5 h-5" \/>\n          <\/motion.button>/;

const inputReplacement = `<input 
            type="text" 
            placeholder="Type a message..." 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none placeholder-gray-400"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className={\`ml-2 p-2 rounded-xl transition-all \${
              messageText.trim() ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            }\`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>`;

content = content.replace(inputRegex, inputReplacement);

const endMessagesRegex = /<\/div>\n            \)\}\n          <\/div>\n        \)\)\}\n      <\/div>/;
const endMessagesReplacement = `</div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>`;

content = content.replace(endMessagesRegex, endMessagesReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed chat');

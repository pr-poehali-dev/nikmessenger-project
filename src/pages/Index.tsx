import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
}

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [authMethod, setAuthMethod] = useState('phone');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Алексей', lastMessage: 'Привет! Как дела?', avatar: 'А' },
    { id: 2, name: 'Мария', lastMessage: 'Встретимся завтра?', avatar: 'М' },
    { id: 3, name: 'Работа', lastMessage: 'Собрание в 15:00', avatar: 'Р' },
    { id: 4, name: 'Дмитрий', lastMessage: 'Спасибо!', avatar: 'Д' },
    { id: 5, name: 'Анна', lastMessage: 'До встречи', avatar: 'А' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Добро пожаловать в NikMessenger', sent: false, time: '14:30' },
    { id: 2, text: 'Спасибо!', sent: true, time: '14:31' },
  ]);

  const handleLogin = () => {
    setIsAuthOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedChat) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageText('');

      setTimeout(() => {
        const reply: Message = {
          id: messages.length + 2,
          text: `Получено: ${messageText}`,
          sent: false,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }, 500);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-2xl flex overflow-hidden animate-fade-in">
        <div className="w-full md:w-[35%] bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-white"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold">
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold">
                      {selectedChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-lg">{selectedChat.name}</h2>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                {messages.map((message, idx) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        message.sent
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className={`text-xs ${message.sent ? 'text-white/70' : 'text-gray-400'} mt-1 block`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Сообщение..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 rounded-full"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity h-10 w-10"
                  >
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-400">
                <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Выберите чат, чтобы начать общение</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Войти в NikMessenger
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={authMethod} onValueChange={setAuthMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phone">Телефон</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 mt-4">
            {authMethod === 'phone' && (
              <Input type="tel" placeholder="+7 (999) 123-45-67" className="rounded-full" />
            )}
            {authMethod === 'email' && (
              <Input type="email" placeholder="example@mail.com" className="rounded-full" />
            )}
            {authMethod === 'google' && (
              <div className="text-center text-gray-500 py-4">
                Войдите через Google аккаунт
              </div>
            )}
            
            <Button 
              onClick={handleLogin}
              className="w-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

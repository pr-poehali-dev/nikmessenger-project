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
  time: string;
  online?: boolean;
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
  
  const [chats, setChats] = useState<Chat[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const handleLogin = () => {
    if (authMethod === 'phone' && userPhone.trim()) {
      setIsAuthOpen(false);
    } else if (authMethod !== 'phone') {
      setIsAuthOpen(false);
    }
  };

  const handleCreateChat = () => {
    const newChatName = prompt('Введите имя контакта:');
    if (newChatName && newChatName.trim()) {
      const newChat: Chat = {
        id: chats.length + 1,
        name: newChatName.trim(),
        lastMessage: 'Начните диалог',
        avatar: newChatName.trim()[0].toUpperCase(),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        online: Math.random() > 0.5
      };
      setChats([newChat, ...chats]);
    }
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


    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0e1621] flex items-center justify-center p-0">
      <div className="w-full max-w-full h-screen bg-white flex overflow-hidden">
        <div className="w-full md:w-[380px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Button size="icon" variant="ghost" className="h-10 w-10">
                <Icon name="Menu" size={20} />
              </Button>
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-md bg-gray-100 border-0"
                />
              </div>
              <Button onClick={handleCreateChat} size="icon" variant="ghost" className="h-10 w-10">
                <Icon name="Plus" size={20} />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <Icon name="MessageSquarePlus" size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">У вас пока нет чатов</h3>
                <p className="text-sm text-gray-500 mb-4">Нажмите на кнопку +, чтобы начать новый диалог</p>
                <Button onClick={handleCreateChat} className="bg-[#3390ec] hover:bg-[#2b7fd6]">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать чат
                </Button>
              </div>
            ) : (
              filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat?.id === chat.id ? 'bg-[#3390ec]/5' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#3390ec] text-white font-medium">
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-medium text-gray-900 text-[15px]">{chat.name}</h3>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#3390ec] text-white font-medium">
                      {selectedChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-medium text-[15px]">{selectedChat.name}</h2>
                    <p className="text-xs text-gray-500">{selectedChat.online ? 'в сети' : 'был(а) недавно'}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-[#0e1621] space-y-2" style={{backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+)'}}>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white/40">
                      <Icon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Начните переписку</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, idx) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div
                      className={`max-w-[65%] px-3 py-2 rounded-lg ${
                        message.sent
                          ? 'bg-[#3390ec] text-white rounded-br-none shadow-sm'
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-[15px]">{message.text}</p>
                      <span className={`text-[11px] ${message.sent ? 'text-white/80' : 'text-gray-400'} mt-0.5 block text-right`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2 items-end">
                  <Button type="button" size="icon" variant="ghost" className="h-9 w-9 shrink-0">
                    <Icon name="Paperclip" size={20} className="text-gray-500" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Сообщение"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-[#3390ec] hover:bg-[#2b7fd6] h-9 w-9 shrink-0"
                  >
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0e1621]" style={{backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+)'}}>
              <div className="text-center text-white/40">
                <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">Выберите чат, чтобы начать общение</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#3390ec]">
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
              <Input 
                type="tel" 
                placeholder="+7 (999) 123-45-67" 
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="rounded-md" 
              />
            )}
            {authMethod === 'email' && (
              <Input type="email" placeholder="example@mail.com" className="rounded-md" />
            )}
            {authMethod === 'google' && (
              <div className="text-center text-gray-500 py-4">
                Войдите через Google аккаунт
              </div>
            )}
            
            <Button 
              onClick={handleLogin}
              className="w-full rounded-md bg-[#3390ec] hover:bg-[#2b7fd6]"
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
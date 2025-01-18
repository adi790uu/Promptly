import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Home,
  BookMarked,
  ArrowLeft,
  Send,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuthForm } from "./components/Auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  //@ts-ignore
  const [authType, setAuthType] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (chrome?.bookmarks?.getRecent) {
      chrome.bookmarks.getRecent(5, (items) => {
        setBookmarks(items);
      });
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "This is a simulated response. Integrate with your actual chat API here.",
            sender: "bot",
          },
        ]);
      }, 1000);
    }
  };

  if (!user) {
    return <AuthForm type={authType} />;
  }

  if (showChat) {
    return (
      <div className="w-full h-screen bg-background text-foreground">
        <Card className="w-full h-full rounded-none border-0">
          <CardHeader className="pb-4 px-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
                className="-ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl font-bold">Chat</CardTitle>
                <CardDescription>Ask anything</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-[calc(100%-6rem)]">
            <div className="flex-1 overflow-auto mb-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background text-foreground">
      <Card className="w-full h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                Chrome Extension
              </CardTitle>
              <CardDescription>Welcome, {user.username}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid grid-cols-3 mb-4 mx-4">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="flex items-center gap-2"
              >
                <BookMarked className="w-4 h-4" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="px-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setShowChat(true)}>
                    New Chat
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      chrome.tabs.create({ url: "chrome://bookmarks" })
                    }
                  >
                    All Bookmarks
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="px-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Recent Bookmarks</h2>
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <Button
                      key={bookmark.id}
                      variant="ghost"
                      className="w-full justify-start truncate"
                      onClick={() => chrome.tabs.create({ url: bookmark.url })}
                    >
                      {bookmark.title || bookmark.url}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="px-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Extension settings will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Home, BookMarked } from "lucide-react";
import { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  useEffect(() => {
    if (chrome?.bookmarks?.getRecent) {
      chrome.bookmarks.getRecent(5, (items) => {
        setBookmarks(items);
      });
    }
  }, []);

  return (
    <div className="w-full h-screen bg-background text-foreground">
      <Card className="w-full h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Chrome Extension</CardTitle>
          <CardDescription>Built with React & shadcn/ui</CardDescription>
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
                  <Button
                    variant="outline"
                    onClick={() =>
                      chrome.tabs.create({ url: "chrome://newtab" })
                    }
                  >
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

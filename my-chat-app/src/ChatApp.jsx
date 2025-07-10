import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  LoadingIndicator,
} from 'stream-chat-react';

import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

import { STREAM_API_KEY, USER_ID, BACKEND_URL } from './env';

const chatClient = StreamChat.getInstance(STREAM_API_KEY);

export default function ChatApp() {
  const [clientReady, setClientReady] = useState(false);
  const [channel, setChannel] = useState(null);

  // Fetch token from backend
  const getUserToken = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/get-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get token');
      return data.token;
    } catch (err) {
      console.error('Token fetch error:', err);
      throw err;
    }
  };

  useEffect(() => {
    async function initChat() {
      try {
        const token = await getUserToken(USER_ID);
        await chatClient.connectUser(
          {
            id: USER_ID,
            name: 'Frontend User',
            image: 'https://getstream.io/random_svg/?id=frontend&name=User',
          },
          token
        );

        const channel = chatClient.channel('messaging', 'stream-chat', {
          name: 'Chat',
          members: [USER_ID],
        });

        await channel.watch();
        setChannel(channel);
        setClientReady(true);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }

    initChat();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!clientReady || !channel) return <LoadingIndicator />;

  return (
     <div className="ChatApp">
    <Chat client={chatClient} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
    </div>
  );
}

"use client";
import React, { useCallback, useState } from "react";
import { useUserContext } from "../context";
import { handleAddConversation, handleAddMessage } from "../server-actions";
import MessageDisplay from "../components/MessageDisplay";
import { useRouter } from "next/navigation";
import { db, collection, addDoc, firebaseAuth } from "../firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import logoutLogo from "../icons/logout.png";
import chatHistoryLogo from "../icons/chat-history.png";
import { ClipLoader } from "react-spinners";
type AssistantResponse = {
  assistantResponse: string;
};
const ChatbotSection = () => {
  const auth = firebaseAuth;
  const userContext = useUserContext();
  const router = useRouter();
  const [userMessage, setUserMessage] = useState("");

  const [messages, setMessages] = useState<string[]>(userContext.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(false);
  const addMessageToState = (newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    userContext.setMessageArr(messages);
  };

  const handleSendMessage = useCallback(async () => {
    setIsLoading(true);
    while (firebaseAuth.currentUser?.uid === undefined) {}
    if (userContext.currentConversationId === -1) {
      const newConversationId = await handleAddConversation({
        user_id: firebaseAuth.currentUser.uid,
        date_created: new Date().toDateString(),
      });

      while (newConversationId === undefined || newConversationId === -1) {}
      userContext.setCurrentConversation(newConversationId);

      const addedFirebaseDoc = await addDoc(collection(db, "chat-history"), {
        user_id: firebaseAuth.currentUser.uid,
        conversation_id: newConversationId,
        date_created: new Date().toDateString(),
      });

      await handleAddMessage({
        conversation_id: newConversationId,
        content: userMessage,
        is_user_message: true,
      });
      addMessageToState(userMessage);
      await handleOpenAiRequest(newConversationId);
      setUserMessage("");
      return;
    }

    await handleAddMessage({
      conversation_id: userContext.currentConversationId,
      content: userMessage,
      is_user_message: true,
    });
    addMessageToState(userMessage);
    await handleOpenAiRequest(userContext.currentConversationId);
    setUserMessage("");
    setIsLoading(false);
  }, [userMessage, messages, userContext]);
  const handleChatHistoryClick = () => {
    setIsChatHistoryLoading(true);
    userContext.setMessageArr(messages);
    router.push("chat-history-section");
  };

  const handleOpenAiRequest = async (newConversationId: number) => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: AssistantResponse = await response.json();

      addMessageToState(data.assistantResponse);

      await handleAddMessage({
        conversation_id: newConversationId,
        content: data.assistantResponse,
        is_user_message: false,
      });
      setIsLoading(false);
    } catch (error) {
      console.log("An error occurred while sending message:", error);
    }
  };

  const handleLogoutClick = async () => {
    try {
      userContext.setCurrentConversation(-1);
      userContext.setMessageArr([]);

      setUserMessage("");

      setMessages([]);
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.log("An error occured while signing out:", error);
    }
  };
  const handleNewChat = () => {
    setUserMessage("");
    userContext.setCurrentConversation(-1);
    userContext.setMessageArr([]);
    setMessages([]);
  };
  return (
    <div className="flex h-screen w-full justify-center overflow-hidden">
      <div className="mx-auto h-full w-full rounded-md bg-white shadow-md">
        <div className=" mt-5 flex justify-evenly ">
          <div>
            <h1 className="mb-4 text-center text-4xl font-bold">CHATBOT</h1>
          </div>
          <div className="mr-5 mt-2 flex justify-end gap-4">
            <div>
              <Image
                src={logoutLogo.src}
                alt="Logout"
                width="25"
                height="25"
                onClick={() => handleLogoutClick()}
                className="cursor-pointer hover:scale-110"
              ></Image>
              <div className="text-center font-bold">Logout</div>
            </div>
            <div>
              {!isChatHistoryLoading && (
                <Image
                  src={chatHistoryLogo.src}
                  alt="Chat History"
                  width="25"
                  height="25"
                  onClick={() => handleChatHistoryClick()}
                  className="cursor-pointer hover:scale-110"
                ></Image>
              )}
              {isChatHistoryLoading && (
                <ClipLoader color="black" size={20}></ClipLoader>
              )}
              <div className="text-center font-bold">Chat History</div>
            </div>
          </div>
        </div>
        <div className="flex h-full justify-center">
          <div className="h-full w-1/2">
            <MessageDisplay messages={messages} />
            <div className="flex gap-5">
            <textarea
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
      className="w-full px-4 py-3 mt-5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
      placeholder="Message"
      style={{ minHeight: '50px', maxHeight: '200px',height:'50px' }} 
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          if (!isLoading) await handleSendMessage();
        }
      }}
    />
              <button
                onClick={async () => {
                  if (!isLoading) await handleSendMessage();
                }}
                className="mt-4 max-h-14 bg-blue-500 px-4  py-2 text-white hover:bg-blue-600 "
              >
                {!isLoading && <div>Send</div>}
                {isLoading && (
                  <div>
                    <ClipLoader color="white" size={25}></ClipLoader>
                  </div>
                )}
              </button>
              <button
                onClick={() => {
                  if (!isLoading) {
                    handleNewChat();
                  }
                }}
                className="mt-4 w-36 max-h-14 bg-green-500   py-2 text-white hover:bg-green-600 "
              >
                New Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSection;

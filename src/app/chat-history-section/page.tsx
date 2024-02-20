"use client";

import React, { useEffect, useState } from "react";
import { handleGetMessages, handleDeleteConversation } from "../server-actions";
import { useUserContext } from "../context";
import { type ConversationGetInfo } from "~/server/db";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import trashLogo from "../icons/trash.png";
import { db, collection, getDocs, deleteDoc, doc } from "../firebase";
import { ClipLoader } from "react-spinners";
import Select from "react-select"

export interface FirebaseConversationGetInfo {
  doc_id: string;
  user_id: string;
  conversation_id: number;
  date_created: string;
}

const ChatHistorySection = () => {
  const router = useRouter();
  const userContext = useUserContext();
  const [conversations, setConversations] =
    useState<FirebaseConversationGetInfo[]>();
  const [deleteCounter, setDeleteCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isConversationsEmpty, setIsConversationsEmpty] = useState(false);
  const sortOptions=[
    {value:'mostRecent',label:'Most recent'},
    {value:'oldest',label:'Oldest'}
  ]

  const [sortOption,setSortOption]=useState({value:'mostRecent',label:'Most recent'})
  useEffect(() => {
    const getConversations = async () => {
      const query = await getDocs(collection(db, "chat-history"));
      const firebaseChatHistoryData: FirebaseConversationGetInfo[] = [];
      query.forEach((doc) => {
        const { user_id, conversation_id, date_created } = doc.data();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        firebaseChatHistoryData.unshift({ doc_id: doc.id, user_id, conversation_id,date_created});
        if(sortOption.value===sortOptions[1]?.value){
firebaseChatHistoryData.reverse()
        }


      });
      setConversations(firebaseChatHistoryData);
      setIsLoading(false);
      if (firebaseChatHistoryData.length <= 0) setIsConversationsEmpty(true);
      else setIsConversationsEmpty(false);
    };
    void getConversations();
  }, [deleteCounter,sortOption]);
  const handleChatClick = async (conversation: ConversationGetInfo) => {
    const clickedChatMessages = await handleGetMessages(
      conversation.conversation_id,
    );
    if (!clickedChatMessages) return;
    userContext.setMessageArr(clickedChatMessages);
    userContext.setCurrentConversation(conversation.conversation_id);
    router.push("/chatbot-section");
  };
  const handleDeleteClick = async (
    conversation: FirebaseConversationGetInfo,
  ) => {

    setIsLoading(true)
    await handleDeleteConversation(conversation.conversation_id);
    setDeleteCounter(deleteCounter + 1);
    if (userContext.currentConversationId === conversation.conversation_id) {
      userContext.setMessageArr([]);
      userContext.setCurrentConversation(-1);
    }
    const docRef = doc(db, "chat-history", conversation.doc_id);

    await deleteDoc(docRef);

    setIsLoading(false)
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <h2 className="mb-4 text-2xl font-bold">CHAT HISTORY</h2>
      {isConversationsEmpty && (
        <div className="flex justify-center text-2xl">No chats</div>
      )}
      {
        !isConversationsEmpty && 
        <div className=" flex gap-1 float-right">
        <label className="mt-1 text-lg">Sort by:</label>
        <Select options={sortOptions} value={sortOption} onChange={(e)=>{if(e!==null)setSortOption(e)}} className="w-40"></Select>
        </div>
      }
      <div className="space-y-4 mt-12">
        <div className="flex justify-center">
          {isLoading && <ClipLoader color="black" size={50}></ClipLoader>}
        </div>
        {conversations?.map((conversation, index) => (
          <div>
            <div>{conversation.date_created}</div>
            <div className="flex justify-between gap-2">
              <div
                onClick={() => handleChatClick(conversation)}
                className="w-full bg-white p-2 hover:scale-95"
              >
                <p className="mb-2 text-lg font-semibold">Chat #{index + 1}</p>
              </div>
                <Image
                  onClick={() => handleDeleteClick(conversation)}
                  src={trashLogo.src}
                  width="23"
                  height="25"
                  alt="Trash(Delete)"
                  className="mt-2 max-h-8 hover:scale-110"
                ></Image>
            </div>
          </div>
        ))}
      </div>
      <div>

      <Link href="/chatbot-section" className="w-32">
        <div className="focus:shadow-outline-blue mt-5 flex w-32 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
          Back to chat
        </div>
      </Link>
     
      </div>
    </div>
  );
};

export default ChatHistorySection;

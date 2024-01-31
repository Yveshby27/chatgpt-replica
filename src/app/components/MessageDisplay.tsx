import React from "react";
import Image from "next/image";
import humanLogo from "../icons/human.png";
import aiLogo from "../icons/ai.png";
interface MessageDisplayProps {
  messages?: string[];
}

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
  return (
    <div className="w-100 mt-4 h-80 overflow-auto break-all bg-gray-100 p-4 text-lg">
      {messages?.map((message, index) => (
        <div key={index} className="mb-3 flex gap-1">
          {index % 2 === 0 ? (
            <Image
              alt="User"
              src={humanLogo.src}
              width="24"
              height="24"
              className="max-h-6 max-w-6"
            />
          ) : (
            <Image
              alt="AI Chatbot"
              src={aiLogo.src}
              width="24"
              height="24"
              className="max-h-6 max-w-6"
            />
          )}
          <div>{message}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;

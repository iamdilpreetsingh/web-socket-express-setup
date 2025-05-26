import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:8000");

    socketRef.current.on("connect", () => {
      setConnected(true);
      addLog({
        text: `Connected with ID: ${socketRef.current.id}`,
        sender: "server",
      });
    });

    socketRef.current.on("response", (data) => {
      addLog({ text: data, sender: "server" });
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
      addLog({ text: "Disconnected from server", sender: "server" });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const addLog = (msg) => {
    setChatLog((prev) => [...prev, msg]);
  };

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      addLog({ text: message, sender: "me" });
      socketRef.current.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Socket.IO Chat</h1>

      <div className="w-full max-w-md bg-gray-800 p-4 rounded-xl shadow-lg space-y-4 flex flex-col">
        <div
          ref={chatContainerRef}
          className="h-150 overflow-y-auto bg-gray-700 p-3 rounded flex flex-col space-y-2"
        >
          {chatLog.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm break-words my-2 ${
                msg.sender === "me"
                  ? "self-end bg-blue-600 text-white"
                  : "self-start bg-gray-600 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded bg-gray-600 placeholder-gray-300 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      <p
        className={`mt-4 text-sm ${
          connected ? "text-green-400" : "text-red-400"
        }`}
      >
        {connected ? "Connected" : "Disconnected"}
      </p>
    </div>
  );
}

export default App;

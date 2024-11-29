import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Chat() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedModel, setSelectedModel] = useState("bert");
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
      fetchMessages();
      fetchHistory();
    } else {
      setIsLoggedIn(false);
    }
  }, [id]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/history/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      data.reverse();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", conversationId: id };
      setMessages([...messages, newMessage]);
      
  
      try {
        const response = await fetch("http://localhost:5000/api/add-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newMessage),
        });
  
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
  
      setTyping(true);
  
      try {
        const response = await fetch(`http://localhost:8000/${selectedModel}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ query: input }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch response from model");
        }
  
        const data = await response.json();
        const botMessage = { text: "", sender: "sys", conversationId: id };
  
        // Typing effect simulation
        let index = 0;
        setMessages((prevMessages)=>[...prevMessages,botMessage])
        const typingEffect = setInterval(() => {
          botMessage.text += data.response[index];
          
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { ...botMessage },
          ]);
          index++;
          if (index === data.response.length) {
            clearInterval(typingEffect);
            setTyping(false);
  
            // Save the complete bot message
            saveBotMessage({ ...botMessage, text: data.response, conversationId: id });
          }
        }, 50); // Adjust typing speed here
      } catch (error) {
        console.error("Error fetching response from model:", error);
        setTyping(false);
      }
    }
  };
  
  const saveBotMessage = async (botMessage) => {
    try {
      const response = await fetch("http://localhost:5000/api/add-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(botMessage),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save bot message");
      }
    } catch (error) {
      console.error("Error saving bot message:", error);
    }
  };
  
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const createChat = async () => {
    const title = prompt("Enter the title for the new chat:");
    if (title) {
      try {
        const response = await fetch("http://localhost:5000/api/create-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ name: title, messages: [] }),
        });
        console.log(response)
        if (!response.ok) {
          throw new Error(`Failed to create new chat: ${response.statusText}`);
        }
        const data = await response.json()
        console.log(data)
        navigate(`/chat/${data._id}`)
        fetchHistory(); // Refresh chat history
      } catch (error) {
        console.error("Error creating new chat:", error);
      }
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Chat History</h2>
        <button
          onClick={createChat}
          className="w-full bg-blue-500 text-white py-2 px-4 mb-6 rounded hover:bg-blue-600 transition duration-300 focus:outline-none"
        >
          New Chat
        </button>
        <div ref={chatHistoryRef} className="overflow-y-auto h-[calc(100vh-150px)]">
          {history.map((message, index) => (
            <div
              onClick={() => { navigate(`/chat/${message._id}`); }}
              key={index}
              className="text-left text-white mb-4 cursor-pointer p-2 hover:bg-gray-700 rounded"
            >
              {message.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300 w-full">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div className="flex items-center">
            <label className="mr-4 text-lg font-semibold text-gray-700">
              Current Model:
              <span className="ml-2 text-xl text-blue-800">{selectedModel}</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none bg-blue-100 text-blue-800"
            >
              <option value="bert">bert</option>
              <option value="gpt2">GPT-2</option>
              <option value="gemini">Gemini</option>
              <option value="llama3">Llama 3</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white ">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-4 rounded-lg shadow-sm max-w-[90%] ${
                  message.sender === "user" ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
          {typing && (
            <div className="self-start text-left text-green-500 mb-2">
              <span className="inline-block p-2 bg-gray-300 rounded-lg shadow-sm">
                Typing...
              </span>
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-100 border-t border-gray-300">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="ml-4 bg-blue-500 text-white py-4 px-8 rounded hover:bg-blue-600 transition duration-300 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// function Chat() {
//   const { id } = useParams();
//   const [history, setHistory] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("bart");
//   const [typing, setTyping] = useState(false);
//   const navigate = useNavigate();
//   const authToken = localStorage.getItem("authToken");
//   const chatHistoryRef = useRef(null);

//   useEffect(() => {
//     if (authToken) {
//       setIsLoggedIn(true);
//       fetchMessages();
//       fetchHistory();
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, [id]);

//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/history/${id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch messages: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setMessages(data.messages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/history", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch messages: ${response.statusText}`);
//       }

//       const data = await response.json();
//       data.reverse();
//       setHistory(data);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleSend = async () => {
//     if (input.trim()) {
//       const newMessage = { text: input, sender: "user", conversationId: id };
//       setMessages([...messages, newMessage]);

//       try {
//         const response = await fetch("http://localhost:5000/api/add-message", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authToken}`,
//           },
//           body: JSON.stringify(newMessage),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to send message");
//         }
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }

//       setTyping(true);

//       const formData = new FormData();
//       formData.append("query", input);
//       if (image) {
//         formData.append("image", image);
//       }

//       try {
//         const response = await fetch(`http://localhost:8000/${selectedModel}`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//           body: formData,
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch response from model");
//         }

//         const data = await response.json();
//         const botMessage = { text: "", sender: "sys", conversationId: id };

//         let index = 0;
//         setMessages((prevMessages) => [...prevMessages, botMessage]);
//         const typingEffect = setInterval(() => {
//           botMessage.text += data.response[index];

//           setMessages((prevMessages) => [
//             ...prevMessages.slice(0, -1),
//             { ...botMessage },
//           ]);
//           index++;
//           if (index === data.response.length) {
//             clearInterval(typingEffect);
//             setTyping(false);

//             saveBotMessage({
//               ...botMessage,
//               text: data.response,
//               conversationId: id,
//             });
//           }
//         }, 50);
//       } catch (error) {
//         console.error("Error fetching response from model:", error);
//         setTyping(false);
//       }
//     }
//   };

//   const saveBotMessage = async (botMessage) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/add-message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(botMessage),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save bot message");
//       }
//     } catch (error) {
//       console.error("Error saving bot message:", error);
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigate("/login");
//   };

//   const createChat = async () => {
//     const title = prompt("Enter the title for the new chat:");
//     if (title) {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/create-history",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authToken}`,
//             },
//             body: JSON.stringify({ name: title, messages: [] }),
//           }
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to create new chat: ${response.statusText}`);
//         }
//         const data = await response.json();
//         navigate(`/chat/${data._id}`);
//         fetchHistory(); // Refresh chat history
//       } catch (error) {
//         console.error("Error creating new chat:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="w-1/4 bg-gray-900 text-white p-6">
//         <h2 className="text-2xl font-semibold mb-6">Chat History</h2>
//         <button
//           onClick={createChat}
//           className="w-full bg-blue-500 text-white py-2 px-4 mb-6 rounded hover:bg-blue-600 transition duration-300 focus:outline-none"
//         >
//           New Chat
//         </button>
//         <div
//           ref={chatHistoryRef}
//           className="overflow-y-auto h-[calc(100vh-150px)]"
//         >
//           {history.map((message, index) => (
//             <div
//               onClick={() => {
//                 navigate(`/chat/${message._id}`);
//               }}
//               key={index}
//               className="text-left text-white mb-4 cursor-pointer p-2 hover:bg-gray-700 rounded"
//             >
//               {message.name}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex-1 flex flex-col">
//         <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300 w-full">
//           <h1 className="text-2xl font-bold">Chat</h1>
//           <div className="flex items-center">
//             <label className="mr-4 text-lg font-semibold text-gray-700">
//               Current Model:
//               <span className="ml-2 text-xl text-blue-800">{selectedModel}</span>
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="p-2 border border-gray-300 rounded focus:outline-none bg-blue-100 text-blue-800"
//             >
//               <option value="bart">Bart</option>
//               <option value="gpt2">GPT-2</option>
//               <option value="gemini">Gemini</option>
//               <option value="llama3">Llama 3</option>
//             </select>
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 bg-white">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`mb-4 ${
//                 message.sender === "user" ? "text-right" : "text-left"
//               }`}
//             >
//               <span
//                 className={`inline-block p-4 rounded-lg shadow-sm max-w-[90%] ${
//                   message.sender === "user" ? "bg-blue-100" : "bg-green-100"
//                 }`}
//               >
//                 {message.text}
//               </span>
//             </div>
//           ))}
//           {typing && (
//             <div className="self-start text-left text-green-500 mb-2">
//               <span className="inline-block p-2 bg-gray-300 rounded-lg shadow-sm">
//                 Typing...
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="p-6 bg-gray-100 border-t border-gray-300">
//           <div className="flex">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-1 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Type your message..."
//             />
//             <input
//               type="file"
//               onChange={(e) => setImage(e.target.files[0])}
//               className="ml-4"
//             />
//             <button
//               onClick={handleSend}
//               className="ml-4 bg-blue-500 text-white py-4 px-8 rounded hover:bg-blue-600 transition duration-300 focus:outline-none"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

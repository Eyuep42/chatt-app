import React, { useState, useRef, useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import "./chatRoom.css"

type ChatMessage = {
    sender: string;
    content: string;
    type: "JOIN" | "LEAVE" | "CHAT";
};

const colors = [
    "#2196F3",
    "#32c787",
    "#00BCD4",
    "#ff5652",
    "#ffc107",
    "#ff85af",
    "#FF9800",
    "#39bbb0",
];

function getAvatarColor(sender: string): string {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash = 31 * hash + sender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

const ChatApp: React.FC = () => {
    const [username, setUsername] = useState("");
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    const stompClientRef = useRef<Client | null>(null);

    const connect = () => {
        const client = new Client({
            brokerURL: "http://localhost:8080/ws", // direkt WebSocket
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                setConnected(true);

                client.subscribe("/topic/public", (payload: IMessage) => {
                    const message: ChatMessage = JSON.parse(payload.body);
                    setMessages((prev) => [...prev, message]);
                });

                client.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify({ sender: username, type: "JOIN" }),
                });
            },
            onDisconnect: () => {
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error("Broker error: " + frame.headers["message"]);
            },
            onWebSocketError: (event) => {
                console.error("WebSocket error", event);
            },
        });

        client.activate();
        stompClientRef.current = client;
    };

    useEffect(() => {
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && stompClientRef.current) {
            const chatMessage: ChatMessage = {
                sender: username,
                content: input,
                type: "CHAT",
            };
            stompClientRef.current.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });
            setInput("");
        }
    };

    return (
        <div className="chat-app">
            {!connected ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (username.trim()) connect();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button type="submit">Join Chat</button>
                </form>
            ) : (
                <div className="chat-page">
                    <ul id="messageArea">
                        {messages.map((msg, idx) => (
                            <li
                                key={idx}
                                className={msg.type === "CHAT" ? "chat-message" : "event-message"}
                            >
                                {msg.type === "CHAT" ? (
                                    <>
                                        <i
                                            style={{
                                                backgroundColor: getAvatarColor(msg.sender),
                                            }}
                                        >
                                            {msg.sender[0]}
                                        </i>
                                        <span>{msg.sender}</span>
                                        <p>{msg.content}</p>
                                    </>
                                ) : (
                                    <p>
                                        {msg.sender} {msg.type === "JOIN" ? "joined!" : "left!"}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={sendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatApp;

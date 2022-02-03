import React, { useEffect, useState } from "react";
import axios from 'axios';

const ChatPage = () => {

    const [chats, setChats] = useState([]);

    // fetch the data from backend --> GET --> /api/chat
    const fetchChats = async () => {

        const chatsData = await axios.get('/api/chat');
        console.log(chatsData);
        console.log(chatsData.data);
        setChats(chatsData.data);
    }

    useEffect(
        () => {
            fetchChats();
        }, []
    )

    return (
        <div className="bg-blue-400 p-4">
            Chat Page
            {
                chats.map((chat) => {

                    return (
                        <li key={chat._id}> {JSON.stringify(chat)} </li>
                    )
                })
            }
        </div>
    )
};

export default ChatPage;

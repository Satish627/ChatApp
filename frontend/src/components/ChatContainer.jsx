import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from "../lib/utils";
import { ThumbsUp, Heart, Smile, X } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, addOrUpdateReaction } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    // States to track the active message and visibility of reactions
    const [activeMessageId, setActiveMessageId] = useState(null);
    const [reactionTimeout, setReactionTimeout] = useState(null);  // To track timeout for showing reaction box
    const reactionBoxRef = useRef(null); // To track click outside the reaction box

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Detect clicks outside the reaction box to hide it
    const hideReactionBox = (e) => {
        if (reactionBoxRef.current && !reactionBoxRef.current.contains(e.target)) {
            console.log("Clicked outside, hiding reaction box");
            setActiveMessageId(null);  // Hide the reaction box if clicked outside
        }
    };

    // Detect long press (2 seconds hold)
    const handleMessageMouseDown = (messageId) => {
        console.log("Mouse down on message:", messageId);
        setReactionTimeout(
            setTimeout(() => {
                console.log("2 seconds hold detected for message:", messageId);
                setActiveMessageId(messageId);  // Show reaction box after 2 seconds
            }, 2000)
        );
    };

    const handleMessageMouseUp = () => {
        console.log("Mouse up, clearing timeout");
        clearTimeout(reactionTimeout);  // Clear timeout if mouseup happens before 2 seconds
    };

    const handleReactionClick = async (messageId, reaction) => {
        try {
            console.log("Adding/updating reaction:", reaction, "for message:", messageId);
            await addOrUpdateReaction(messageId, reaction);  // Call the function to add/update reaction
        } catch (error) {
            toast.error("Failed to update reaction");
        }
    };

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div
            className='flex-1 flex flex-col overflow-auto'
            onClick={hideReactionBox}  // This will close the reaction box when clicking outside
        >
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                        onMouseDown={() => handleMessageMouseDown(message._id)} // Detect long press
                        onMouseUp={handleMessageMouseUp}  // Clear timeout if mouse is released before 2 seconds
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}

                            {/* Show reactions when message is clicked for more than 2 seconds */}
                            {activeMessageId === message._id && (
                                <div
                                    ref={reactionBoxRef}  // Keep track of the reaction box element
                                    className="flex space-x-2 mt-2"
                                >
                                    <button
                                        className={`reaction-btn ${message.reactions?.includes("like") ? "text-emerald-500" : "text-gray-500"}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReactionClick(message._id, "like");
                                        }}
                                    >
                                        <ThumbsUp size={20} />
                                    </button>
                                    <button
                                        className={`reaction-btn ${message.reactions?.includes("love") ? "text-red-500" : "text-gray-500"}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReactionClick(message._id, "love");
                                        }}
                                    >
                                        <Heart size={20} />
                                    </button>
                                    <button
                                        className={`reaction-btn ${message.reactions?.includes("smile") ? "text-yellow-500" : "text-gray-500"}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReactionClick(message._id, "smile");
                                        }}
                                    >
                                        <Smile size={20} />
                                    </button>
                                    {/* Optional Close Button */}
                                    <button
                                        onClick={hideReactionBox}
                                        className="text-gray-500 ml-2"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {message.reactions?.length > 0 && (
                                <div className="flex gap-1">
                                    {message.reactions.map((reaction, index) => (
                                        <span key={index} className="text-xs">{reaction}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatContainer;

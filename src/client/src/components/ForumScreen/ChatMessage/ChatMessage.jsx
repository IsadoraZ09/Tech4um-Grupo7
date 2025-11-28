import React from "react";

export default function ChatMessage({ message }) {
  return (
    <div
      className={`sala-forum-message${
        message.isPrivate ? " sala-forum-message-private" : ""
      }`}
    >
      <div className="sala-forum-message-body">
        <span className="sala-forum-message-author">
          {message.sender?.username}
        </span>
        <span className="sala-forum-message-text">
          {message.isPrivate ? (
            <b className="sala-forum-private-label">{message.content}</b>
          ) : (
            message.content
          )}
        </span>
      </div>
      <span
        className="sala-forum-avatar sala-forum-avatar-msg"
        style={{
          background: message.sender?.avatar
            ? "none"
            : message.sender?.color || "#e0e0e0",
          border: `2px solid #fff`,
        }}
      >
        {message.sender?.avatar ? (
          <img src={message.sender.avatar} alt={message.sender.username} />
        ) : null}
      </span>
    </div>
  );
}
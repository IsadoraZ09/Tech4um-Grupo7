import React from "react";
import { Link } from "react-router-dom";

export default function RelatedRoomsSidebar({ relatedRooms = [] }) {
  return (
    <aside
      className="sala-forum-sidebar sala-forum-sidebar-right"
      aria-label="Tópicos"
    >
      {relatedRooms.map((room) => (
        <Link
          key={room._id}
          to={`/forum/${room._id}`}
          className="sala-forum-side-room"
        >
          <div className="sala-forum-side-room-title">
            {room.name.length > 18 ? room.name.slice(0, 15) + "..." : room.name}
          </div>
          <div className="sala-forum-side-room-pessoas">
            {room.participants} participantes
          </div>
        </Link>
      ))}
    </aside>
  );
}
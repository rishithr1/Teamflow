import React from 'react';
import { MeetingRoom } from '../../types';

interface MeetingRoomsProps {
  rooms: MeetingRoom[];
  onBookRoom: (room: string) => void;
}

const MeetingRooms: React.FC<MeetingRoomsProps> = ({ rooms, onBookRoom }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Meeting Room Availability
      </h2>
      <div className="space-y-3">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:border-blue-200"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`}
              ></div>
              <div>
                <p className="font-medium text-gray-800">{room.room}</p>
                <p className="text-xs text-gray-500">
                  Capacity: {room.capacity} people
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{room.nextMeeting}</p>
              {room.status === "available" && (
                <button
                  className="text-xs text-blue-500 hover:text-blue-700 mt-1 transition-all duration-300 hover:font-bold"
                  onClick={() => onBookRoom(room.room)}
                >
                  Book now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingRooms;
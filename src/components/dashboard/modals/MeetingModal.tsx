import React, { useState, useEffect } from 'react';
import { TeamMember, MeetingData } from '../../../types';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleMeeting: (meeting: MeetingData) => void;
  teamMembers: TeamMember[];
  initialRoom?: string;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ 
  isOpen, 
  onClose, 
  onScheduleMeeting,
  teamMembers,
  initialRoom = ''
}) => {
  const [meeting, setMeeting] = useState<MeetingData>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    room: initialRoom,
    participants: [],
    domain: "Marketing",
  });
  
  // Update meeting room if initialRoom prop changes
  useEffect(() => {
    if (initialRoom && initialRoom !== meeting.room) {
      setMeeting(prev => ({ ...prev, room: initialRoom }));
    }
  }, [initialRoom]);
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onScheduleMeeting(meeting);
    
    // Reset form
    setMeeting({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
      participants: [],
      domain: "Marketing",
    });
    
    onClose();
  };
  
  const handleParticipantToggle = (name: string, checked: boolean) => {
    if (checked) {
      setMeeting({
        ...meeting,
        participants: [...meeting.participants, name],
      });
    } else {
      setMeeting({
        ...meeting,
        participants: meeting.participants.filter(p => p !== name),
      });
    }
  };
  
  const handleTransferToDomain = () => {
    const selectedMembers = teamMembers.filter(member => 
      meeting.participants.includes(member.name)
    );
    
    if (selectedMembers.length > 0) {
      const targetDomain = prompt(
        "Enter target domain to transfer selected members:",
        "Development"
      );
      
      if (targetDomain) {
        alert(
          `${selectedMembers.length} member(s) transferred to ${targetDomain} domain`
        );
      }
    } else {
      alert("Please select members to transfer");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Schedule Meeting
            </h3>
            <button
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:rotate-90"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meeting title"
                value={meeting.title}
                onChange={(e) =>
                  setMeeting({ ...meeting, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter meeting description"
                value={meeting.description}
                onChange={(e) =>
                  setMeeting({
                    ...meeting,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={meeting.date}
                onChange={(e) =>
                  setMeeting({ ...meeting, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={meeting.startTime}
                  onChange={(e) =>
                    setMeeting({
                      ...meeting,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={meeting.endTime}
                  onChange={(e) =>
                    setMeeting({
                      ...meeting,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Room
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={meeting.room}
                onChange={(e) =>
                  setMeeting({ ...meeting, room: e.target.value })
                }
              >
                <option value="">Select meeting room</option>
                <option value="Conference Room A">
                  Conference Room A (Capacity: 20)
                </option>
                <option value="Conference Room B">
                  Conference Room B (Capacity: 12)
                </option>
                <option value="Meeting Room 1">
                  Meeting Room 1 (Capacity: 8)
                </option>
                <option value="Meeting Room 2">
                  Meeting Room 2 (Capacity: 6)
                </option>
                <option value="Executive Boardroom">
                  Executive Boardroom (Capacity: 10)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={meeting.domain}
                onChange={(e) =>
                  setMeeting({ ...meeting, domain: e.target.value })
                }
              >
                <option value="Marketing">Marketing</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center mb-2 last:mb-0"
                  >
                    <input
                      type="checkbox"
                      id={`participant-${member.id}`}
                      className="mr-2"
                      checked={meeting.participants.includes(member.name)}
                      onChange={(e) => handleParticipantToggle(member.name, e.target.checked)}
                    />
                    <label
                      htmlFor={`participant-${member.id}`}
                      className="text-sm text-gray-700 flex items-center"
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "busy"
                              ? "bg-red-500"
                              : member.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                      ></span>
                      {member.name} - {member.role}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center rounded-button whitespace-nowrap"
                  onClick={handleTransferToDomain}
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Transfer to Domain
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg rounded-button whitespace-nowrap hover:bg-gray-300 transition-all duration-300 hover:opacity-80"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg rounded-button whitespace-nowrap hover:bg-green-600 transition-all duration-300 hover:shadow-lg"
            onClick={handleSubmit}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
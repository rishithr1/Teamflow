import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useNotifications } from '../context/NotificationContext';
import { TeamMember, Activity, MeetingRoom, TaskData, MeetingData } from '../types';
import TeamMembers from '../components/dashboard/TeamMembers';
import Charts from '../components/dashboard/Charts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import MeetingRooms from '../components/dashboard/MeetingRooms';
import NewTaskModal from '../components/dashboard/modals/NewTaskModal';
import MeetingModal from '../components/dashboard/modals/MeetingModal';
import Notifications from '../components/dashboard/Notifications';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { teamMembers, updateTeamMember } = useWebSocket();
  const { notifications, unreadCount } = useNotifications();
  
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showMeetingModal, setShowMeetingModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Recent activities
  const [activities, setActivities] = useState<Activity[]>([
    {
      icon: "fa-check",
      text: "Emily Thompson completed the UI design for Project Alpha",
      time: "2 hours ago",
    },
    {
      icon: "fa-comment",
      text: "New comment on Backend API documentation by Michael Chen",
      time: "3 hours ago",
    },
    {
      icon: "fa-tasks",
      text: "Sarah Wilson started working on the homepage redesign",
      time: "5 hours ago",
    },
  ]);
  
  // Meeting rooms
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([
    {
      room: "Conference Room A",
      capacity: 20,
      status: "available",
      nextMeeting: "Available until 2:00 PM",
    },
    {
      room: "Conference Room B",
      capacity: 12,
      status: "occupied",
      nextMeeting: "Available at 3:30 PM",
    },
    {
      room: "Meeting Room 1",
      capacity: 8,
      status: "available",
      nextMeeting: "Available until 4:00 PM",
    },
    {
      room: "Meeting Room 2",
      capacity: 6,
      status: "occupied",
      nextMeeting: "Available at 1:15 PM",
    },
    {
      room: "Executive Boardroom",
      capacity: 10,
      status: "maintenance",
      nextMeeting: "Under maintenance until tomorrow",
    },
  ]);
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US"));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleAddMember = (name: string, role: string) => {
    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name,
      role,
      status: "online",
    };
    
    updateTeamMember(newMember);
  };
  
  const handleRemoveMember = (id: number) => {
    const memberToRemove = teamMembers.find(m => m.id === id);
    if (memberToRemove) {
      // In a real app, you would call an API to remove the member
      // For now, let's just filter the member out
      const updatedMembers = teamMembers.filter(m => m.id !== id);
      // This is for demo purposes - in a real app, you'd update the server
      console.log(`Removed member: ${memberToRemove.name}`);
    }
  };
  
  const handleCreateTask = (task: TaskData) => {
    // In a real app, you would save the task to a database
    console.log('New task created:', task);
    
    // Add activity
    const newActivity: Activity = {
      icon: "fa-plus",
      text: `New task "${task.title}" assigned to ${task.assignee}`,
      time: "Just now",
    };
    
    setActivities([newActivity, ...activities]);
  };
  
  const handleScheduleMeeting = (meeting: MeetingData) => {
    // In a real app, you would save the meeting to a database
    console.log('New meeting scheduled:', meeting);
    
    // Add activity
    const newActivity: Activity = {
      icon: "fa-calendar",
      text: `New meeting "${meeting.title}" scheduled for ${meeting.date}`,
      time: "Just now",
    };
    
    setActivities([newActivity, ...activities]);
    
    // Update meeting room status if applicable
    setMeetingRooms(prev => 
      prev.map(room => 
        room.room === meeting.room
          ? { ...room, status: "occupied", nextMeeting: `Booked for ${meeting.startTime} - ${meeting.endTime}` }
          : room
      )
    );
  };
  
  const handleBookRoom = (room: string) => {
    setSelectedRoom(room);
    setShowMeetingModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">John Doe</h3>
                <p className="text-sm text-gray-500">Project Manager</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Recent Chats
              </h4>
              <Link
                to="/chat"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-users text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-700">Backend Team</span>
                </div>
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  3
                </span>
              </Link>
              
              <Link
                to="/chat"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-user text-gray-500"></i>
                  </div>
                  <span className="text-sm text-gray-700">Emily Thompson</span>
                </div>
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  1
                </span>
              </Link>
            </div>
            
            <TeamMembers 
              members={teamMembers}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <div className="text-sm text-gray-500">{currentTime}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg rounded-button whitespace-nowrap cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:scale-105"
                  onClick={() => setShowNewTaskModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>New Task
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg rounded-button whitespace-nowrap cursor-pointer hover:bg-green-600 transition-all duration-300 hover:scale-105"
                  onClick={() => setShowMeetingModal(true)}
                >
                  <i className="fas fa-calendar-alt mr-2"></i>Schedule Meeting
                </button>
              </div>
              <button
                className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:rotate-12"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Charts />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActivityFeed activities={activities} />
              <MeetingRooms rooms={meetingRooms} onBookRoom={handleBookRoom} />
            </div>
          </main>
        </div>
        
        {/* Right Sidebar - Notifications */}
        {showNotifications && (
          <Notifications 
            notifications={notifications} 
            onClose={() => setShowNotifications(false)} 
          />
        )}
        
        {/* Modals */}
        <NewTaskModal 
          isOpen={showNewTaskModal} 
          onClose={() => setShowNewTaskModal(false)} 
          onCreateTask={handleCreateTask} 
          teamMembers={teamMembers}
        />
        
        <MeetingModal 
          isOpen={showMeetingModal} 
          onClose={() => setShowMeetingModal(false)} 
          onScheduleMeeting={handleScheduleMeeting} 
          teamMembers={teamMembers}
          initialRoom={selectedRoom}
        />
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { TeamMember } from '../../types';
import Avatar from '../common/Avatar';

interface TeamMembersProps {
  members: TeamMember[];
  onAddMember: (name: string, role: string) => void;
  onRemoveMember: (id: number) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ 
  members, 
  onAddMember, 
  onRemoveMember 
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAddMember = () => {
    const newMemberName = prompt("Enter new team member name:");
    const newMemberRole = prompt("Enter new team member role:");
    if (newMemberName && newMemberRole) {
      onAddMember(newMemberName, newMemberRole);
    }
  };

  const handleRemoveMember = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      onRemoveMember(id);
      setActiveDropdown(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Team Members
        </h4>
        <button
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center rounded-button whitespace-nowrap transition-all duration-300"
          onClick={handleAddMember}
        >
          <i className="fas fa-plus mr-1"></i> Add Member
        </button>
      </div>
      
      {members.map((member) => (
        <div
          key={member.id}
          className="relative flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2 transition-all duration-300 hover:translate-x-1"
          onClick={(e) => toggleDropdown(member.id, e)}
        >
          <Avatar name={member.name} status={member.status} />
          
          <div>
            <p className="text-sm text-gray-700">{member.name}</p>
            <p className="text-xs text-gray-500">{member.role}</p>
          </div>

          {activeDropdown === member.id && (
            <div className="member-dropdown absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <i className="fas fa-user-circle mr-2 text-gray-500"></i>
                  View Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <i className="fas fa-comment mr-2 text-gray-500"></i>
                  Start Chat
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <i className="fas fa-calendar-alt mr-2 text-gray-500"></i>
                  Schedule Meeting
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <i className="fas fa-tasks mr-2 text-gray-500"></i>
                  View Tasks
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <i className="fas fa-exchange-alt mr-2 text-gray-500"></i>
                  Transfer Domain
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center"
                  onClick={(e) => handleRemoveMember(member.id, member.name, e)}
                >
                  <i className="fas fa-user-minus mr-2"></i>
                  Remove Member
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
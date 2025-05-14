import React, { useState } from 'react';
import { TeamMember, TaskData } from '../../../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: TaskData) => void;
  teamMembers: TeamMember[];
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateTask,
  teamMembers
}) => {
  const [task, setTask] = useState<TaskData>({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    dueDate: "",
    project: "",
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onCreateTask(task);
    
    // Reset form
    setTask({
      title: "",
      description: "",
      priority: "Medium",
      assignee: "",
      dueDate: "",
      project: "",
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Create New Task
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
                Task Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                value={task.title}
                onChange={(e) =>
                  setTask({ ...task, title: e.target.value })
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
                placeholder="Enter task description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <div className="flex space-x-4">
                {["High", "Medium", "Low"].map((priority) => (
                  <div key={priority} className="flex items-center">
                    <input
                      type="radio"
                      id={`priority-${priority.toLowerCase()}`}
                      name="priority"
                      className="mr-2"
                      checked={task.priority === priority}
                      onChange={() =>
                        setTask({ ...task, priority })
                      }
                    />
                    <label
                      htmlFor={`priority-${priority.toLowerCase()}`}
                      className="text-sm text-gray-700"
                    >
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={task.assignee}
                onChange={(e) =>
                  setTask({ ...task, assignee: e.target.value })
                }
              >
                <option value="">Select team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={task.dueDate}
                onChange={(e) =>
                  setTask({ ...task, dueDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Project
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={task.project}
                onChange={(e) =>
                  setTask({ ...task, project: e.target.value })
                }
              >
                <option value="">Select project</option>
                <option value="Project Alpha">Project Alpha</option>
                <option value="Backend API">Backend API</option>
                <option value="Homepage Redesign">
                  Homepage Redesign
                </option>
                <option value="Mobile App">Mobile App</option>
              </select>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg rounded-button whitespace-nowrap hover:bg-blue-600 transition-all duration-300 hover:shadow-lg"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
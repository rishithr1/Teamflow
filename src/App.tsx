import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WebSocketProvider } from './context/WebSocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Login from './pages/Login';

// Initial data for the WebSocket context
const initialTeamMembers = [
  {
    id: 1,
    name: "Emily Thompson",
    role: "Product Manager",
    status: "online",
  },
  { id: 2, name: "Michael Chen", role: "Senior Developer", status: "busy" },
  { id: 3, name: "Sarah Wilson", role: "UX Designer", status: "away" },
  {
    id: 4,
    name: "James Anderson",
    role: "Backend Developer",
    status: "online",
  },
  { id: 5, name: "Lisa Martinez", role: "QA Engineer", status: "offline" },
];

const initialMessages = [
  {
    id: 1,
    sender: "Alexander Mitchell",
    content:
      "Team, I've just pushed the latest API optimization changes. Please review when you have a chance.",
    timestamp: "10:30 AM",
    reactions: ["👍", "🚀"],
    hasThread: true,
    attachments: [
      {
        id: "doc1",
        name: "api-optimization-report.pdf",
        type: "application/pdf",
        size: 2457600,
        url: "#",
      },
    ],
  },
  {
    id: 2,
    sender: "Isabella Rodriguez",
    content:
      "I'll take a look at it right away. Are there any specific areas you want me to focus on?",
    timestamp: "10:32 AM",
    reactions: ["👀"],
    hasThread: false,
  },
  {
    id: 3,
    sender: "William Chen",
    content:
      "The database performance metrics are showing significant improvement after the latest optimizations.",
    timestamp: "10:35 AM",
    reactions: ["🎉", "👏"],
    hasThread: true,
    isPinned: true,
    attachments: [
      {
        id: "img1",
        name: "performance-graph.png",
        type: "image/png",
        size: 1048576,
        url: "https://images.pexels.com/photos/7947867/pexels-photo-7947867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: "doc2",
        name: "database-metrics.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1572864,
        url: "#",
      },
    ],
  },
];

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider 
        initialTeamMembers={initialTeamMembers}
        initialMessages={initialMessages}
      >
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
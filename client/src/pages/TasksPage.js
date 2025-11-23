import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, TrendingUp, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { addTask, removeTask, updateTaskInList } from '../redux/taskSlice';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  const filteredTasks = tasks.filter((task) => filterPriority === 'all' || task.priority === filterPriority);
  const completedCount = tasks.filter((t) => t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (!formData.title) {
      toast.error('Please enter task title');
      return;
    }
    dispatch(
      addTask({
        ...formData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
      })
    );
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setShowModal(false);
    toast.success('Task added successfully');
  };

  const handleCompleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      dispatch(updateTaskInList({ ...task, completed: !task.completed }));
      toast.success(task.completed ? 'Task reopened' : 'Task completed');
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(removeTask(id));
    toast.success('Task deleted');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return { background: '#fee2e2', color: '#7f1d1d' };
      case 'medium':
        return { background: '#fed7aa', color: '#92400e' };
      case 'low':
        return { background: '#dcfce7', color: '#15803d' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Tasks</h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Manage your team tasks</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                background: '#a855f7',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#9333ea';
                e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#a855f7';
                e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} /> Add Task
            </button>
          </div>

          {/* Stats Cards Grid - 4 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            {/* Total Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Total Tasks</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{tasks.length}</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>All tasks</div>
              </div>
              <CheckCircle size={56} color="#3b82f6" strokeWidth={1.5} />
            </div>

            {/* Completed Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Completed</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>{completedCount}</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>Done tasks</div>
              </div>
              <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
            </div>

            {/* High Priority Card */}
            <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8', marginBottom: '12px' }}>High Priority</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#581c87', marginBottom: '8px' }}>{highPriorityCount}</div>
                <div style={{ fontSize: '12px', color: '#6b21a8' }}>Urgent tasks</div>
              </div>
              <AlertCircle size={56} color="#a855f7" strokeWidth={1.5} />
            </div>

            {/* Completion Rate Card */}
            <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Completion Rate</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{completionRate}%</div>
                <div style={{ fontSize: '12px', color: '#92400e' }}>Overall progress</div>
              </div>
              <TrendingUp size={56} color="#f97316" strokeWidth={1.5} />
            </div>
          </div>

          {/* Priority Filter */}
          <div style={{ marginBottom: '24px' }}>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s',
                minWidth: '200px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Tasks List */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            {filteredTasks.length > 0 ? (
              <div style={{ divideY: '1px solid #e5e7eb' }}>
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '24px',
                      borderBottom: index < filteredTasks.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      background: index % 2 === 0 ? 'white' : '#f9fafb',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb'}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCompleteTask(task.id)}
                      style={{
                        marginTop: '4px',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#3b82f6'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: task.completed ? '#9ca3af' : '#111827',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            margin: 0
                          }}
                        >
                          {task.title}
                        </h3>
                        <div style={{ ...getPriorityColor(task.priority), display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </div>
                      </div>
                      {task.description && (
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', margin: '8px 0' }}>
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                          <Calendar size={14} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s', padding: '4px' }}
                      onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <CheckCircle size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p style={{ fontSize: '16px', color: '#9ca3af' }}>No tasks found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s'
          }}
          onClick={() => setShowModal(false)}
        >
          {/* Modal Content */}
          <div
            style={{
              background: 'white',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'slideUp 0.3s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Add New Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '24px',
                background: 'white',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddTask}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#a855f7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#9333ea';
                  e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#a855f7';
                  e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Add Task
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.background = '#e5e7eb'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default TasksPage;

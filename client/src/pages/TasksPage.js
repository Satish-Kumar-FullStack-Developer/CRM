import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, TrendingUp, Plus, Trash2, Calendar, AlertCircle, Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchTasks, createTask, deleteTask, updateTask, completeTask } from '../redux/taskSlice';
import { StatusChip, PriorityChip } from '../utils/statusColors';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    // Fetch tasks on component mount
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = tasks.filter((task) => filterPriority === 'all' || task.priority === filterPriority);
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleAddOrUpdateTask = async () => {
    if (!formData.title) {
      toast.error('Please enter task title');
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing && editingTaskId) {
        await dispatch(updateTask(editingTaskId, {
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
        }));
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(formData));
        toast.success('Task added successfully');
      }
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
      });
      setShowModal(false);
      setIsEditing(false);
      setEditingTaskId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await dispatch(completeTask(id));
      toast.success('Task completed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await dispatch(deleteTask(id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task._id === id);
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate.split('T')[0],
        priority: taskToEdit.priority,
      });
      setEditingTaskId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '24px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Tasks</h1>
              <p style={{ color: '#6b7280', fontSize: 'clamp(14px, 3vw, 16px)' }}>Manage your team tasks</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 20px',
                background: '#a855f7',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: 'clamp(13px, 2vw, 15px)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
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

          {/* Stats Cards Grid - Responsive */}
          <div className="grid-responsive" style={{ marginBottom: '40px' }}>
            {/* Total Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Total Tasks</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{tasks.length}</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>All tasks</div>
              </div>
              <CheckCircle size={56} color="#3b82f6" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* Completed Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Completed</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>{completedCount}</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>Done tasks</div>
              </div>
              <CheckCircle size={56} color="#10b981" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* High Priority Card */}
            <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8', marginBottom: '12px' }}>High Priority</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#581c87', marginBottom: '8px' }}>{highPriorityCount}</div>
                <div style={{ fontSize: '12px', color: '#6b21a8' }}>Urgent tasks</div>
              </div>
              <AlertCircle size={56} color="#a855f7" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* Completion Rate Card */}
            <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Completion Rate</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{completionRate}%</div>
                <div style={{ fontSize: '12px', color: '#92400e' }}>Overall progress</div>
              </div>
              <TrendingUp size={56} color="#f97316" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
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
                fontSize: 'clamp(13px, 2vw, 15px)',
                fontFamily: 'inherit',
                background: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s',
                minWidth: '100%',
                maxWidth: '250px'
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

          {/* Tasks List - Responsive */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : filteredTasks.length > 0 ? (
              <>
                {/* Desktop List View */}
                <div className="hide-mobile" style={{ divideY: '1px solid #e5e7eb' }}>
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task._id}
                      style={{
                        padding: 'clamp(16px, 4vw, 24px)',
                        borderBottom: index < filteredTasks.length - 1 ? '1px solid #e5e7eb' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        background: index % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb'}
                    >
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => handleCompleteTask(task._id)}
                        style={{
                          marginTop: '4px',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h3
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: task.status === 'Completed' ? '#9ca3af' : '#111827',
                              textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                              margin: 0
                            }}
                          >
                            {task.title}
                          </h3>
                          <PriorityChip priority={task.priority} />
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
                        onClick={() => handleEditTask(task._id)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s', padding: '4px', flexShrink: 0 }}
                        onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                        onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s', padding: '4px', flexShrink: 0 }}
                        onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mobile Card View */}
                <div className="show-mobile" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      style={{
                        background: 'white',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleCompleteTask(task._id)}
                          style={{
                            marginTop: '2px',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#3b82f6',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: task.status === 'Completed' ? '#9ca3af' : '#111827',
                              textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                              margin: '0 0 8px 0',
                              wordBreak: 'break-word'
                            }}
                          >
                            {task.title}
                          </h3>
                          <PriorityChip priority={task.priority} />
                        </div>
                      </div>

                      {task.description && (
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', margin: '0 0 12px 0' }}>
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                          <Calendar size={13} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px', paddingTop: task.dueDate ? '0' : '12px', borderTop: task.dueDate ? 'none' : '1px solid #e5e7eb' }}>
                        <button
                          onClick={() => handleEditTask(task._id)}
                          style={{ flex: 1, background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.target.style.background = '#9333ea'}
                          onMouseLeave={(e) => e.target.style.background = '#a855f7'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
              padding: 'clamp(20px, 5vw, 32px)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'slideUp 0.3s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#111827', marginBottom: 'clamp(16px, 4vw, 24px)' }}>Add New Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: 'clamp(13px, 2vw, 15px)',
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
                padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: 'clamp(13px, 2vw, 15px)',
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
                padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: 'clamp(13px, 2vw, 15px)',
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
                padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: 'clamp(13px, 2vw, 15px)',
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

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddOrUpdateTask}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                  background: isSubmitting ? '#d8b4fe' : '#a855f7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = '#9333ea';
                    e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = '#a855f7';
                    e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : isEditing ? 'Update Task' : 'Add Task'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: 'clamp(13px, 2vw, 15px)',
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

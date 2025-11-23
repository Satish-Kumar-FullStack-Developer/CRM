import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Search,
  Calendar,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Modal } from '../components/UI';
import {
  addLead,
  removeLead,
} from '../redux/leadSlice';
import {
  addDeal,
  removeDeal,
} from '../redux/dealSlice';
import {
  addTask,
  removeTask,
  updateTaskInList,
} from '../redux/taskSlice';
import { toast } from 'react-toastify';

export const LeadsPage = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.leads);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = () => {
    if (!formData.firstName || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    dispatch(
      addLead({
        ...formData,
        id: Date.now(),
        score: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
      })
    );
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
    });
    setShowModal(false);
    toast.success('Lead added successfully');
  };

  const handleDeleteLead = (id) => {
    dispatch(removeLead(id));
    toast.success('Lead deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Manage and track your leads</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'lost', label: 'Lost' },
            ]}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {leads.length}
                </p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Qualified</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {leads.filter((l) => l.status === 'qualified').length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {leads.length > 0
                    ? Math.round(
                        leads.reduce((sum, l) => sum + (l.score || 0), 0) /
                          leads.length
                      )
                    : 0}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {leads.length > 0
                    ? Math.round(
                        (leads.filter((l) => l.status === 'qualified').length /
                          leads.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <ArrowUpRight className="text-orange-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredLeads.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        label={lead.status}
                        color={
                          lead.status === 'qualified'
                            ? 'green'
                            : lead.status === 'contacted'
                            ? 'blue'
                            : lead.status === 'lost'
                            ? 'red'
                            : 'gray'
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {lead.score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No leads found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title="Add New Lead"
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'lost', label: 'Lost' },
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddLead}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Lead
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const DealsPage = () => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const [showModal, setShowModal] = useState(false);
  const [filterStage, setFilterStage] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'prospecting',
    probability: 25,
    closingDate: '',
  });

  const filteredDeals = deals.filter(
    (deal) => filterStage === 'all' || deal.stage === filterStage
  );

  const handleAddDeal = () => {
    if (!formData.title || !formData.value) {
      toast.error('Please fill in required fields');
      return;
    }
    dispatch(
      addDeal({
        ...formData,
        id: Date.now(),
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        createdAt: new Date().toISOString(),
      })
    );
    setFormData({
      title: '',
      value: '',
      stage: 'prospecting',
      probability: 25,
      closingDate: '',
    });
    setShowModal(false);
    toast.success('Deal added successfully');
  };

  const handleDeleteDeal = (id) => {
    dispatch(removeDeal(id));
    toast.success('Deal deleted');
  };

  const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed'];
  const totalValue = filteredDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
            <p className="text-gray-600 mt-1">Manage your sales pipeline</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Deal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Deals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {deals.length}
                </p>
              </div>
              <DollarSign className="text-blue-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${(totalValue / 1000).toFixed(1)}K
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg Deal Size</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  $
                  {deals.length > 0
                    ? Math.round(totalValue / deals.length)
                    : 0}
                </p>
              </div>
              <BarChart3 className="text-purple-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Closed Won</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {deals.filter((d) => d.stage === 'closed').length}
                </p>
              </div>
              <CheckCircle className="text-orange-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            options={[
              { value: 'all', label: 'All Stages' },
              { value: 'prospecting', label: 'Prospecting' },
              { value: 'qualification', label: 'Qualification' },
              { value: 'proposal', label: 'Proposal' },
              { value: 'negotiation', label: 'Negotiation' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
            return (
              <Card key={stage} className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-900 capitalize mb-3">
                  {stage}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {stageDeals.length}
                </p>
                <p className="text-sm text-gray-600">${(stageValue / 1000).toFixed(1)}K</p>
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{
                      width: `${totalValue > 0 ? (stageValue / totalValue) * 100 : 0}%`,
                    }}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Deals List */}
        <Card className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredDeals.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Expected Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal, index) => (
                  <tr
                    key={deal.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{deal.title}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      ${deal.value?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge label={deal.stage} color="blue" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      ${Math.round((deal.value * deal.probability) / 100).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No deals found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title="Add New Deal"
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Deal Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            placeholder="Deal Value ($)"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
          <Select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            options={[
              { value: 'prospecting', label: 'Prospecting' },
              { value: 'qualification', label: 'Qualification' },
              { value: 'proposal', label: 'Proposal' },
              { value: 'negotiation', label: 'Negotiation' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Probability: {formData.probability}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) =>
                setFormData({ ...formData, probability: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <Input
            placeholder="Closing Date"
            type="date"
            value={formData.closingDate}
            onChange={(e) =>
              setFormData({ ...formData, closingDate: e.target.value })
            }
          />
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddDeal}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Deal
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const TasksPage = () => {
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

  const filteredTasks = tasks.filter(
    (task) => filterPriority === 'all' || task.priority === filterPriority
  );

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
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your team tasks</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.length}
                </p>
              </div>
              <CheckCircle className="text-blue-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.filter((t) => t.completed).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.filter((t) => t.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </Card>
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.length > 0
                    ? Math.round(
                        (tasks.filter((t) => t.completed).length / tasks.length) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
        </div>

        {/* Tasks List */}
        <Card className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`font-semibold text-lg ${
                          task.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                      />
                    </div>
                    {task.description && (
                      <p className="text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No tasks found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title="Add New Task"
        onClose={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
          <Input
            placeholder="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
          <Select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddTask}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Task
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ReportsPage = () => {
  const { leads } = useSelector((state) => state.leads);
  const { deals } = useSelector((state) => state.deals);
  const { tasks } = useSelector((state) => state.tasks);

  const totalDealsValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const closedDealsValue = deals
    .filter((d) => d.stage === 'closed')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Total Leads</p>
                <p className="text-3xl font-bold mt-2">{leads.length}</p>
              </div>
              <Users size={32} className="opacity-80" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Pipeline Value</p>
                <p className="text-3xl font-bold mt-2">
                  ${(totalDealsValue / 1000).toFixed(1)}K
                </p>
              </div>
              <DollarSign size={32} className="opacity-80" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">Revenue (Won)</p>
                <p className="text-3xl font-bold mt-2">
                  ${(closedDealsValue / 1000).toFixed(1)}K
                </p>
              </div>
              <TrendingUp size={32} className="opacity-80" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold mt-2">
                  {tasks.filter((t) => !t.completed).length}
                </p>
              </div>
              <CheckCircle size={32} className="opacity-80" />
            </div>
          </Card>
        </div>

        {/* Sales Pipeline Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Pipeline</h2>
            <div className="space-y-4">
              {['prospecting', 'qualification', 'proposal', 'negotiation', 'closed'].map(
                (stage) => {
                  const stageDeals = deals.filter((d) => d.stage === stage);
                  const stageValue = stageDeals.reduce(
                    (sum, d) => sum + (d.value || 0),
                    0
                  );
                  const percentage =
                    totalDealsValue > 0 ? (stageValue / totalDealsValue) * 100 : 0;
                  return (
                    <div key={stage}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700 capitalize">
                          {stage}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${(stageValue / 1000).toFixed(1)}K ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>

          <Card className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Status</h2>
            <div className="space-y-4">
              {['new', 'contacted', 'qualified', 'lost'].map((status) => {
                const statusLeads = leads.filter((l) => l.status === status);
                const percentage = leads.length > 0 ? (statusLeads.length / leads.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 capitalize">
                        {status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {statusLeads.length} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.length > 0
                  ? Math.round(
                      (leads.filter((l) => l.status === 'qualified').length /
                        leads.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {deals.length > 0
                  ? Math.round(totalDealsValue / deals.length)
                  : 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {deals.length > 0
                  ? Math.round((deals.filter((d) => d.stage === 'closed').length / deals.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: user?.department || '',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit2 size={20} />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <Select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                options={[
                  { value: 'sales', label: 'Sales' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'support', label: 'Support' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">First Name</p>
                  <p className="font-medium text-gray-900">{formData.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Name</p>
                  <p className="font-medium text-gray-900">{formData.lastName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-medium text-gray-900 capitalize">
                  {formData.department}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Security Settings */}
        <Card className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">
                  Update your password regularly for security
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Change</Button>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                Enable
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

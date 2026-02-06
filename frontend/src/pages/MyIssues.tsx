import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { issueAPI } from '../api/Issue-api.ts';
import ViewIssue from '../components/ViewIssue';
import UpdateIssue from '../components/UpdateIssue';
import CreateIssue from '../components/CreateIssue';
import Pagination from '../components/Pagination';

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  severity: 'Minor' | 'Moderate' | 'Major' | 'Critical';
  createdAt: string;
  updatedAt: string;
}

const MyIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const itemsPerPage = 4;

  useEffect(() => {
    fetchMyIssues();
  }, []);

  // Debounce search term to optimize performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMyIssues = async () => {
    setLoading(true);
    setError('');
    const result = await issueAPI.getUserIssues();

    if (result.success && result.data) {
      setIssues(result.data);
    } else {
      setError(result.message || 'Failed to fetch your issues');
    }
    setLoading(false);
  };

  const handleDelete = async (issueId: string) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    setDeletingId(issueId);
    const result = await issueAPI.deleteIssue(issueId);

    if (result.success) {
      toast.success('Issue deleted successfully! 🗑️');
      // Refresh the issues list
      fetchMyIssues();
    } else {
      setError(result.message || 'Failed to delete issue');
    }
    setDeletingId(null);
  };

  // Filter issues based on search and filters - optimized with useMemo
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Search filter
      const matchesSearch = debouncedSearchTerm === '' || 
        issue.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
      
      // Priority filter
      const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
      
      // Severity filter
      const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesSeverity;
    });
  }, [issues, debouncedSearchTerm, statusFilter, priorityFilter, severityFilter]);

  // Calculate status counts from all issues
  const statusCounts = {
    Open: issues.filter(issue => issue.status === 'Open').length,
    'In Progress': issues.filter(issue => issue.status === 'In Progress').length,
    Resolved: issues.filter(issue => issue.status === 'Resolved').length,
    Closed: issues.filter(issue => issue.status === 'Closed').length,
    Total: issues.length
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      'Open': 'bg-blue-100 text-blue-800 border-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Resolved': 'bg-green-100 text-green-800 border-green-300',
      'Closed': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    const styles = {
      'Low': 'bg-slate-50 text-slate-700 border-slate-300',
      'Medium': 'bg-blue-50 text-blue-700 border-blue-300',
      'High': 'bg-orange-50 text-orange-700 border-orange-300',
      'Critical': 'bg-red-50 text-red-700 border-red-300'
    };
    return styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  // Severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Minor':
        return '';
      case 'Moderate':
        return '';
      case 'Major':
        return '';
      case 'Critical':
        return '';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination logic - using filtered issues
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, priorityFilter, severityFilter]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSeverityFilter('All');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Issues</h1>
            <p className="text-gray-600 text-lg">Issues created and managed by you</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Create New Issue"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/all-issues')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-lg font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All Issues
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Issues */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">My Total</p>
                <p className="text-4xl font-bold">{statusCounts.Total}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Open Issues */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold mb-1">Open</p>
                <p className="text-4xl font-bold text-blue-700">{statusCounts.Open}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* In Progress Issues */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold mb-1">In Progress</p>
                <p className="text-4xl font-bold text-yellow-700">{statusCounts['In Progress']}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Resolved Issues */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold mb-1">Resolved</p>
                <p className="text-4xl font-bold text-green-700">{statusCounts.Resolved}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Closed Issues */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Closed</p>
                <p className="text-4xl font-bold text-gray-700">{statusCounts.Closed}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search your issues by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value="All">All Severities</option>
                  <option value="Minor">Minor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' || severityFilter !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>

            {/* Filter Results Info */}
            {filteredIssues.length !== issues.length && (
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Showing {filteredIssues.length} of {issues.length} issues
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-b-4 border-purple-400 opacity-75"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Your Issues</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Issues List */}
        {!loading && !error && (
          <>
            {filteredIssues.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
                <svg className="mx-auto w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Issues Found</h3>
                <p className="text-gray-500">
                  {issues.length === 0 
                    ? "You haven't created any issues yet. Start by creating your first issue!"
                    : 'No issues match your current filters. Try adjusting your search or filters.'}
                </p>
                {issues.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filteredIssues.length === issues.length 
                      ? `My Issues (${issues.length})`
                      : `Filtered Issues (${filteredIssues.length}/${issues.length})`}
                  </h2>
                </div>

                {currentIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-2xl mt-1">{getSeverityIcon(issue.severity)}</span>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {issue.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                              {issue.description}
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3">
                          <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusBadge(issue.status)}`}>
                            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                            {issue.status}
                          </span>

                          <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getPriorityBadge(issue.priority)}`}>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                            {issue.priority} Priority
                          </span>

                          <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border-2 border-gray-200">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {issue.severity} Severity
                          </span>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px]">
                        <div className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(issue.createdAt)}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedIssueId(issue._id)}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingIssue(issue)}
                            className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                            title="Edit Issue"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(issue._id)}
                            disabled={deletingId === issue._id}
                            className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Issue"
                          >
                            {deletingId === issue._id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && filteredIssues.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* View Issue Modal */}
        {selectedIssueId && (
          <ViewIssue
            issueId={selectedIssueId}
            onClose={() => setSelectedIssueId(null)}
          />
        )}

        {/* Update Issue Modal */}
        {editingIssue && (
          <UpdateIssue
            issue={editingIssue}
            onClose={() => setEditingIssue(null)}
            onUpdate={fetchMyIssues}
          />
        )}

        {/* Create Issue Modal */}
        {showCreateModal && (
          <CreateIssue
            onClose={() => setShowCreateModal(false)}
            onCreate={fetchMyIssues}
          />
        )}
      </div>
    </div>
  );
};

export default MyIssues;

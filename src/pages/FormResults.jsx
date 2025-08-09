import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Download, 
  Search,
  Eye,
  FileText,
  Award,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { formsAPI, responsesAPI } from '../services/api';
import { formatDate, formatDuration, calculatePercentage } from '../utils/helpers';
import Loading from '../components/common/Loading';

const FormResults = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    scoreRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchFormData();
  }, [id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const [formData, responsesData] = await Promise.all([
        formsAPI.getForm(id),
        responsesAPI.getFormResponses(id)
      ]);
      
      setForm(formData.data);
      setResponses(responsesData.data);
      setAnalytics(calculateAnalytics(responsesData.data, formData.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (responses, form) => {
    if (!responses.length) return null;

    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.isCompleted).length;
    const averageScore = responses.reduce((sum, r) => sum + (r.totalScore || 0), 0) / totalResponses;
    const averageTime = responses.reduce((sum, r) => sum + (r.completionTime || 0), 0) / totalResponses;
    
    // Score distribution
    const scoreRanges = [
      { range: '0-20%', count: 0 },
      { range: '21-40%', count: 0 },
      { range: '41-60%', count: 0 },
      { range: '61-80%', count: 0 },
      { range: '81-100%', count: 0 }
    ];

    responses.forEach(response => {
      const percentage = (response.totalScore / response.maxScore) * 100;
      if (percentage <= 20) scoreRanges[0].count++;
      else if (percentage <= 40) scoreRanges[1].count++;
      else if (percentage <= 60) scoreRanges[2].count++;
      else if (percentage <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    // Daily submissions
    const dailySubmissions = {};
    responses.forEach(response => {
      const date = new Date(response.submittedAt).toDateString();
      dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
    });

    const submissionTrend = Object.entries(dailySubmissions)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      totalResponses,
      completedResponses,
      completionRate: (completedResponses / totalResponses) * 100,
      averageScore,
      averageTime,
      scoreDistribution: scoreRanges,
      submissionTrend
    };
  };

  const exportResults = async () => {
    try {
      const csvData = responses.map(response => ({
        'Respondent Name': response.respondentName || 'Anonymous',
        'Email': response.respondentEmail || 'N/A',
        'Score': `${response.totalScore}/${response.maxScore}`,
        'Percentage': `${((response.totalScore / response.maxScore) * 100).toFixed(1)}%`,
        'Completion Time': formatDuration(response.completionTime),
        'Submitted At': formatDate(response.submittedAt),
        'Status': response.isCompleted ? 'Completed' : 'Incomplete'
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title}_results.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = !filters.searchTerm || 
      (response.respondentName && response.respondentName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (response.respondentEmail && response.respondentEmail.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 p-8">Error: {error}</div>;
  if (!form) return <div className="text-center p-8">Form not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {form.title} - Results
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created {formatDate(form.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportResults}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <Link
                to={`/forms/${id}/preview`}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'responses', name: 'Responses', icon: FileText },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Responses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalResponses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.averageScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatDuration(analytics.averageTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Distribution */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Score Distribution
                </h3>
                <div className="space-y-4">
                  {analytics.scoreDistribution.map((item, index) => {
                    const maxCount = Math.max(...analytics.scoreDistribution.map(d => d.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{item.range}</div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                            <div 
                              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-8 text-sm font-medium text-gray-900 dark:text-white">{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submission Trend */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Submissions
                </h3>
                <div className="space-y-3">
                  {analytics.submissionTrend.slice(-7).map((item, index) => {
                    const maxCount = Math.max(...analytics.submissionTrend.map(d => d.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-20 text-xs text-gray-600 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-6 text-xs font-medium text-gray-900 dark:text-white">{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'responses' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Responses Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Respondent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredResponses.map((response, index) => (
                      <tr key={response._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {response.respondentName || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {response.respondentEmail || 'No email'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {response.totalScore}/{response.maxScore}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {((response.totalScore / response.maxScore) * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDuration(response.completionTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(response.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            response.isCompleted
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          }`}>
                            {response.isCompleted ? 'Completed' : 'Incomplete'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detailed Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Performance Metrics</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Highest Score: {Math.max(...responses.map(r => r.totalScore))}</li>
                    <li>Lowest Score: {Math.min(...responses.map(r => r.totalScore))}</li>
                    <li>Median Score: {responses.sort((a, b) => a.totalScore - b.totalScore)[Math.floor(responses.length / 2)]?.totalScore || 0}</li>
                    <li>Pass Rate (&gt;60%): {responses.filter(r => (r.totalScore / r.maxScore) > 0.6).length} ({((responses.filter(r => (r.totalScore / r.maxScore) > 0.6).length / responses.length) * 100).toFixed(1)}%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Time Analysis</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Fastest Completion: {formatDuration(Math.min(...responses.map(r => r.completionTime || 0)))}</li>
                    <li>Slowest Completion: {formatDuration(Math.max(...responses.map(r => r.completionTime || 0)))}</li>
                    <li>Median Time: {formatDuration(responses.sort((a, b) => (a.completionTime || 0) - (b.completionTime || 0))[Math.floor(responses.length / 2)]?.completionTime || 0)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResults;
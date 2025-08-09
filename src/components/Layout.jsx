import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Settings, 
  User,
  Plus,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Create Form', href: '/editor', icon: Plus },
    { name: 'My Forms', href: '/forms', icon: FileText },
    { name: 'Published Forms', href: '/published', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">FormBuilder</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <Icon className="flex-shrink-0 w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Demo User</p>
              <p className="text-xs text-gray-500">demo@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                {/* Breadcrumb */}
                <div className="ml-4 lg:ml-0">
                  <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                      <li>
                        <div className="flex items-center text-sm text-gray-500">
                          {getPageTitle(location.pathname)}
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Settings */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper function to get page title based on pathname
function getPageTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/editor')) return 'Form Editor';
  if (pathname.startsWith('/form/')) return 'Fill Form';
  if (pathname.startsWith('/results/')) return 'Form Results';
  if (pathname.startsWith('/published')) return 'Published Forms';
  return 'FormBuilder';
}

export default Layout;
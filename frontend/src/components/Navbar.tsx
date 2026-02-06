import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">IssueTracker</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <a href="manage-issues" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Manage Issues
            </a>
            <a href="signin" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Sign In
            </a>
            <a href="signup" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

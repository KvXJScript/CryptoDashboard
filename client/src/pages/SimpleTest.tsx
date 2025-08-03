export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          🚀 Crypto Dashboard Test Page
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ✅ Deployment Successful!
          </h2>
          <p className="text-blue-700 dark:text-blue-300">
            The app is loading correctly. Components and routing are working.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🔧 Build Status
            </h3>
            <p className="text-green-600 dark:text-green-400">All systems operational</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🎨 Styling
            </h3>
            <p className="text-green-600 dark:text-green-400">Tailwind CSS working</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🚦 Routing
            </h3>
            <p className="text-green-600 dark:text-green-400">Wouter routing active</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Next Steps:
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Switch to full Dashboard view</li>
            <li>• Test crypto price loading</li>
            <li>• Verify trading functionality</li>
            <li>• Check portfolio persistence</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
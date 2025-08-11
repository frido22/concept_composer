import { TestResult } from '../utils/testRunner';

interface TestOutputProps {
  result: TestResult | null;
  isVisible: boolean;
  onClose: () => void;
}

const TestOutput = ({ result, isVisible, onClose }: TestOutputProps) => {
  if (!isVisible || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {result.success ? 'Test Results - SUCCESS' : 'Test Results - FAILED'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="font-mono text-sm">
            {result.output.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
            
            {result.errors.map((error, index) => (
              <div key={index} className="text-red-600 mb-1">
                {error}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#6A89A7] text-white rounded hover:bg-[#384959]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestOutput;
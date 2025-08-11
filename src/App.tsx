import { useCallback, useState } from 'react';
import Canvas from './components/Canvas';
import Palette from './components/Palette';
import PropertiesPanel from './components/PropertiesPanel';
import TestOutput from './components/TestOutput';
import { useComposerGraph } from './hooks/useComposerGraph';
import { runSimulation, TestResult } from './utils/testRunner';

function App() {
  const {
    nodes,
    edges,
    selectedNodes,
    setNodes,
    setEdges,
    setSelectedNodes,
    addConcept,
    addSync,
    updateNode,
    exportGraph,
    resetGraph,
    loadCompleteExample,
    loadUrlShortenerDemo,
    loadUpvotesDemo,
    loadRateLimitDemo
  } = useComposerGraph();

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showTestOutput, setShowTestOutput] = useState(false);

  const handleTest = useCallback(() => {
    const graph = exportGraph();
    const result = runSimulation(graph);
    setTestResult(result);
    setShowTestOutput(true);
  }, [exportGraph]);

  const handleExport = useCallback(async () => {
    try {
      const graph = exportGraph();
      
      // For now, just log the graph structure
      // In a full implementation, this would call the codegen module
      console.log('Exported graph:', JSON.stringify(graph, null, 2));
      
      // Create a simple downloadable file for demonstration
      const dataStr = JSON.stringify(graph, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'concept-composer-graph.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Graph exported as JSON! In a full implementation, this would generate a TypeScript project.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [exportGraph]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top toolbar */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center gap-4">
        <h1 className="text-xl font-bold">Concept Composer</h1>
        <div className="flex-1" />
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'counter') loadCompleteExample();
            else if (value === 'url') loadUrlShortenerDemo();
            else if (value === 'upvotes') loadUpvotesDemo(); 
            else if (value === 'ratelimit') loadRateLimitDemo();
            e.target.value = '';
          }}
          className="px-3 py-2 bg-[#6A89A7] text-white rounded hover:bg-[#384959]"
          defaultValue=""
        >
          <option value="" disabled>Load Demo ▼</option>
          <option value="counter">Counter Nudge</option>
          <option value="url">URL Shortener</option>
          <option value="upvotes">Upvotes Feed</option>
          <option value="ratelimit">Rate Limit Form</option>
        </select>
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Run
        </button>
        <button
          onClick={resetGraph}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#384959] text-white rounded hover:bg-[#6A89A7]"
        >
          Export
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Left sidebar - Palette */}
        <Palette
          onAddConcept={addConcept}
          onAddSync={addSync}
          currentNodes={nodes}
        />

        {/* Canvas */}
        <div className="flex-1">
          <Canvas
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onSelectionChange={setSelectedNodes}
          />
        </div>

        {/* Right sidebar - Properties */}
        <PropertiesPanel
          selectedNodes={selectedNodes}
          onUpdateNode={updateNode}
        />
        
        <TestOutput
          result={testResult}
          isVisible={showTestOutput}
          onClose={() => setShowTestOutput(false)}
        />
      </div>
    </div>
  );
}

export default App;
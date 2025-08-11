import { useState } from 'react';
import { ComposerNode, ConceptData, SyncData, Action } from '../types';

interface PropertiesPanelProps {
  selectedNodes: ComposerNode[];
  onUpdateNode: (nodeId: string, data: any) => void;
}

const PropertiesPanel = ({ selectedNodes, onUpdateNode }: PropertiesPanelProps) => {
  const selectedNode = selectedNodes[0];

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-300 p-4">
        <h3 className="text-lg font-bold mb-4">Properties</h3>
        <p className="text-gray-600">Select a node to edit properties</p>
      </div>
    );
  }

  if (selectedNode.type === 'concept') {
    return <ConceptProperties node={selectedNode} onUpdate={onUpdateNode} />;
  }

  if (selectedNode.type === 'sync') {
    return <SyncProperties node={selectedNode} onUpdate={onUpdateNode} />;
  }

  return null;
};

interface ConceptPropertiesProps {
  node: ComposerNode;
  onUpdate: (nodeId: string, data: any) => void;
}

const ConceptProperties = ({ node, onUpdate }: ConceptPropertiesProps) => {
  const concept = (node.data as any).concept as ConceptData;
  
  const updateConcept = (updatedConcept: ConceptData) => {
    onUpdate(node.id, { concept: updatedConcept });
  };

  const addStateField = () => {
    const name = prompt('Field name:');
    const type = prompt('Field type:', 'string');
    if (name && type) {
      updateConcept({
        ...concept,
        stateFields: [...concept.stateFields, { name, type }]
      });
    }
  };

  const removeStateField = (index: number) => {
    updateConcept({
      ...concept,
      stateFields: concept.stateFields.filter((_, i) => i !== index)
    });
  };

  const addAction = () => {
    const name = prompt('Action name:');
    if (name) {
      const kind = confirm('Is this a query action?') ? 'query' : 'action';
      const actionName = kind === 'query' && !name.startsWith('_') ? `_${name}` : name;
      updateConcept({
        ...concept,
        actions: [...concept.actions, { name: actionName, kind, input: [], output: [] }]
      });
    }
  };

  const removeAction = (index: number) => {
    updateConcept({
      ...concept,
      actions: concept.actions.filter((_, i) => i !== index)
    });
  };

  const updateAction = (index: number, updatedAction: Action) => {
    const newActions = [...concept.actions];
    newActions[index] = updatedAction;
    updateConcept({
      ...concept,
      actions: newActions
    });
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-300 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Concept Properties</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name:</label>
        <input
          type="text"
          value={concept.name}
          onChange={(e) => updateConcept({ ...concept, name: e.target.value })}
          className="w-full px-2 py-1 border rounded"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold">State Fields</h4>
          <button 
            onClick={addStateField}
            className="px-2 py-1 bg-[#6A89A7] text-white rounded text-sm hover:bg-[#384959]"
          >
            +
          </button>
        </div>
        {concept.stateFields.map((field, index) => (
          <div key={index} className="flex items-center mb-2 p-2 bg-white rounded">
            <span className="flex-1 text-sm">{field.name}: {field.type}</span>
            <button 
              onClick={() => removeStateField(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold">Actions</h4>
          <button 
            onClick={addAction}
            className="px-2 py-1 bg-[#6A89A7] text-white rounded text-sm hover:bg-[#384959]"
          >
            +
          </button>
        </div>
        {concept.actions.map((action, index) => (
          <ActionEditor
            key={index}
            action={action}
            onChange={(updatedAction) => updateAction(index, updatedAction)}
            onRemove={() => removeAction(index)}
          />
        ))}
      </div>
    </div>
  );
};

interface ActionEditorProps {
  action: Action;
  onChange: (action: Action) => void;
  onRemove: () => void;
}

const ActionEditor = ({ action, onRemove }: ActionEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = action.kind === 'query' ? action.name.replace(/^_/, '') : action.name;

  return (
    <div className="mb-2 p-2 bg-white rounded border">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left text-sm font-medium"
        >
          {displayName} ({action.kind})
        </button>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">×</button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          <div>
            <label className="block text-xs font-medium">Input Fields:</label>
            {action.input.map((field, i) => (
              <div key={i} className="text-xs">{field.name}: {field.type}{field.optional ? '?' : ''}</div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium">Output Fields:</label>
            {action.output.map((field, i) => (
              <div key={i} className="text-xs">{field.name}: {field.type}{field.optional ? '?' : ''}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SyncProperties = ({ node, onUpdate }: ConceptPropertiesProps) => {
  const sync = (node.data as any).sync as SyncData;
  
  const updateSync = (updatedSync: SyncData) => {
    onUpdate(node.id, { sync: updatedSync });
  };

  const addVar = () => {
    const name = prompt('Variable name:');
    if (name && name.trim()) {
      updateSync({
        ...sync,
        vars: [...sync.vars, name.trim()]
      });
    }
  };

  const removeVar = (index: number) => {
    updateSync({
      ...sync,
      vars: sync.vars.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-300 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Sync Properties</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name:</label>
        <input
          type="text"
          value={sync.name}
          onChange={(e) => updateSync({ ...sync, name: e.target.value })}
          className="w-full px-2 py-1 border rounded"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold">Variables</h4>
          <button 
            onClick={addVar}
            className="px-2 py-1 bg-[#384959] text-white rounded text-sm hover:bg-[#88BDF2] hover:text-[#384959]"
          >
            +
          </button>
        </div>
        {sync.vars.map((varName, index) => (
          <div key={index} className="flex items-center mb-2 p-2 bg-white rounded">
            <span className="flex-1 text-sm">${varName}</span>
            <button 
              onClick={() => removeVar(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">When Patterns</h4>
        {sync.when.map((pattern, index) => (
          <div key={index} className="p-2 bg-white rounded mb-2 text-sm">
            {pattern.conceptId.split(':')[1]}.{pattern.action}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">Where Steps</h4>
        {sync.where.map((step, index) => (
          <div key={index} className="p-2 bg-white rounded mb-2 text-sm">
            {step.op}: {step.conceptId?.split(':')[1]}.{step.method} {step.expr}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">Then Actions</h4>
        {sync.then.map((pattern, index) => (
          <div key={index} className="p-2 bg-white rounded mb-2 text-sm">
            {pattern.conceptId.split(':')[1]}.{pattern.action}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPanel;
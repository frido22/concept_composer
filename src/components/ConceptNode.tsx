import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ConceptNodeData, Action } from '../types';

const ConceptNode = memo(({ data, selected }: any) => {
  const { concept } = data as ConceptNodeData;

  const renderAction = (action: Action, index: number) => {
    const isQuery = action.kind === 'query';
    const displayName = isQuery ? action.name.replace(/^_/, '') : action.name;
    
    return (
      <div key={index} className="mb-2 p-2 bg-gray-50 rounded relative">
        <div className="font-medium text-sm">{displayName}</div>
        
        <Handle
          type="target"
          position={Position.Left}
          id={`${concept.id}#${action.name}#input`}
          style={{ 
            top: '50%', 
            left: -8, 
            backgroundColor: '#6A89A7',
            transform: 'translateY(-50%)'
          }}
          title={action.input.length > 0 ? `Input: ${action.input.map(f => f.name).join(', ')}` : 'Input (trigger)'}
        />
        
        <Handle
          type="source"
          position={Position.Right}
          id={`${concept.id}#${action.name}#output`}
          style={{ 
            top: '50%', 
            right: -8, 
            backgroundColor: '#6A89A7',
            transform: 'translateY(-50%)'
          }}
          title={action.output.length > 0 ? `Output: ${action.output.map(f => f.name).join(', ')}` : 'Output (signal)'}
        />
        
        <div className="text-xs text-gray-600 mt-1">
          {action.input.length > 0 && (
            <div>In: {action.input.map(f => `${f.name}: ${f.type}${f.optional ? '?' : ''}`).join(', ')}</div>
          )}
          {action.output.length > 0 && (
            <div>Out: {action.output.map(f => `${f.name}: ${f.type}${f.optional ? '?' : ''}`).join(', ')}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-[#BDDDFC] border-2 rounded-3xl p-4 min-w-48 shadow-sm ${selected ? 'border-[#6A89A7] shadow-md' : 'border-[#6A89A7]'}`}>
      <div className="font-bold text-lg mb-3 text-center bg-white text-[#384959] p-3 rounded-full shadow-sm">
        {concept.name}
      </div>
      
      {concept.stateFields.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1">State:</div>
          {concept.stateFields.map((field: any, index: number) => (
            <div key={index} className="text-xs text-gray-600">
              {field.name}: {field.type} {field.init && `= ${field.init}`}
            </div>
          ))}
        </div>
      )}
      
      <div>
        <div className="text-sm font-medium mb-2">Actions:</div>
        {concept.actions.map(renderAction)}
      </div>
    </div>
  );
});

ConceptNode.displayName = 'ConceptNode';

export default ConceptNode;
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { SyncNodeData } from '../types';

const SyncNode = memo(({ data, selected }: NodeProps<SyncNodeData>) => {
  const { sync } = data;

  return (
    <div className={`bg-[#384959] border-2 border-[#384959] rounded-none p-4 min-w-64 shadow-lg ${selected ? 'shadow-xl border-[#88BDF2]' : ''}`}>
      <div className="font-bold text-lg mb-3 text-center bg-[#88BDF2] text-[#384959] p-2 rounded-none">
        {sync.name}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id={`${sync.id}#when`}
        style={{ 
          top: '50%', 
          left: -8, 
          backgroundColor: '#384959',
          transform: 'translateY(-50%)'
        }}
        title="When inlet"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id={`${sync.id}#then`}
        style={{ 
          top: '50%', 
          right: -8, 
          backgroundColor: '#384959',
          transform: 'translateY(-50%)'
        }}
        title="Then outlet"
      />
      
      {sync.vars.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1 text-white">Vars:</div>
          <div className="text-xs text-gray-300">
            {sync.vars.map(v => `$${v}`).join(', ')}
          </div>
        </div>
      )}
      
      {sync.when.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1 text-white">When:</div>
          {sync.when.map((pattern, index) => (
            <div key={index} className="text-xs text-gray-300 mb-1">
              {pattern.conceptId.split(':')[1]}.{pattern.action}
            </div>
          ))}
        </div>
      )}
      
      {sync.where.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1 text-white">Where:</div>
          {sync.where.map((step, index) => (
            <div key={index} className="text-xs text-gray-300 mb-1">
              {step.op === 'query' && step.conceptId && step.method && 
                `${step.conceptId.split(':')[1]}.${step.method}`}
              {step.op === 'filter' && step.expr}
            </div>
          ))}
        </div>
      )}
      
      {sync.then.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1 text-white">Then:</div>
          {sync.then.map((pattern, index) => (
            <div key={index} className="text-xs text-gray-300 mb-1">
              {pattern.conceptId.split(':')[1]}.{pattern.action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SyncNode.displayName = 'SyncNode';

export default SyncNode;
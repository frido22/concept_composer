import { useState } from 'react';
import { ConceptData, SyncData } from '../types';

interface PaletteProps {
  onAddConcept: (concept: ConceptData) => void;
  onAddSync: (sync: SyncData) => void;
  currentNodes?: any[]; // To determine what's already on canvas
}

const createDefaultConcept = (name: string): ConceptData => ({
  id: `Concept:${name}`,
  name,
  stateFields: [],
  actions: []
});

const createDefaultSync = (name: string): SyncData => ({
  id: `Sync:${name}`,
  name,
  vars: [],
  when: [],
  where: [],
  then: []
});

const Palette = ({ onAddConcept, onAddSync, currentNodes = [] }: PaletteProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    demos: false,
    urlShortener: false,
    upvotes: false,
    rateLimit: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Check what's currently on canvas to show relevant sections
  // const hasBasicDemo = currentNodes.some((node: any) => 
  //   node.data?.concept?.name === 'Button' || 
  //   node.data?.concept?.name === 'Counter' || 
  //   node.data?.concept?.name === 'Notification'
  // );
  
  const hasUrlDemo = currentNodes.some((node: any) => 
    node.data?.concept?.name === 'UrlShortening' || 
    node.data?.concept?.name === 'NonceGenerator'
  );
  
  const hasUpvoteDemo = currentNodes.some((node: any) => 
    node.data?.concept?.name === 'Upvote' || 
    node.data?.concept?.name === 'Recommendation'  
  );
  
  const hasRateDemo = currentNodes.some((node: any) => 
    node.data?.concept?.name === 'RateLimiter'
  );
  const handleAddConcept = () => {
    const name = prompt('Enter concept name:');
    if (name && name.trim()) {
      onAddConcept(createDefaultConcept(name.trim()));
    }
  };

  const handleAddSync = () => {
    const name = prompt('Enter sync name:');
    if (name && name.trim()) {
      onAddSync(createDefaultSync(name.trim()));
    }
  };

  const addPredefinedButton = () => {
    onAddConcept({
      id: 'Concept:Button',
      name: 'Button',
      stateFields: [],
      actions: [
        {
          name: 'clicked',
          kind: 'action',
          input: [
            { name: 'kind', type: 'string' },
            { name: 'by', type: 'string', optional: true }
          ],
          output: [
            { name: 'kind', type: 'string' },
            { name: 'by', type: 'string', optional: true }
          ]
        }
      ]
    });
  };

  const addPredefinedCounter = () => {
    onAddConcept({
      id: 'Concept:Counter',
      name: 'Counter',
      stateFields: [
        { name: 'count', type: 'number', init: '0' }
      ],
      actions: [
        {
          name: 'increment',
          kind: 'action',
          input: [],
          output: []
        },
        {
          name: '_getCount',
          kind: 'query',
          input: [],
          output: [{ name: 'count', type: 'number' }]
        }
      ]
    });
  };

  const addPredefinedNotification = () => {
    onAddConcept({
      id: 'Concept:Notification',
      name: 'Notification',
      stateFields: [],
      actions: [
        {
          name: 'notify',
          kind: 'action',
          input: [
            { name: 'message', type: 'string' },
            { name: 'to', type: 'string', optional: true }
          ],
          output: [
            { name: 'message', type: 'string' },
            { name: 'to', type: 'string', optional: true }
          ]
        }
      ]
    });
  };

  const addPredefinedCounterNudge = () => {
    onAddSync({
      id: 'Sync:CounterNudge',
      name: 'CounterNudge',
      vars: ['user', 'count'],
      when: [
        {
          conceptId: 'Concept:Button',
          action: 'clicked',
          inputBindings: { kind: 'inc', by: 'user' },
          outputBindings: { by: 'user' }
        },
        {
          conceptId: 'Concept:Counter',
          action: 'increment',
          inputBindings: {},
          outputBindings: {}
        }
      ],
      where: [
        {
          op: 'query',
          conceptId: 'Concept:Counter',
          method: '_getCount',
          input: {},
          outputBindings: { count: 'count' }
        },
        {
          op: 'filter',
          expr: 'count === 3'
        }
      ],
      then: [
        {
          conceptId: 'Concept:Notification',
          action: 'notify',
          inputBindings: { message: '`reached 3`', to: 'user' }
        }
      ]
    });
  };

  // URL Shortener concepts
  const addUrlShorteningConcept = () => {
    onAddConcept({
      id: 'Concept:UrlShortening',
      name: 'UrlShortening',
      stateFields: [
        { name: 'shortUrl', type: 'string' },
        { name: 'longUrl', type: 'string' }
      ],
      actions: [
        {
          name: 'register',
          kind: 'action',
          input: [
            { name: 'shortUrl', type: 'string' },
            { name: 'longUrl', type: 'string' }
          ],
          output: [{ name: 'shortUrl', type: 'string' }]
        },
        {
          name: 'lookup',
          kind: 'action',
          input: [{ name: 'shortUrl', type: 'string' }],
          output: [{ name: 'longUrl', type: 'string' }]
        },
        {
          name: 'delete',
          kind: 'action',
          input: [{ name: 'shortUrl', type: 'string' }],
          output: []
        }
      ]
    });
  };

  const addNonceGeneratorConcept = () => {
    onAddConcept({
      id: 'Concept:NonceGenerator',
      name: 'NonceGenerator',
      stateFields: [],
      actions: [
        {
          name: 'generate',
          kind: 'action',
          input: [],
          output: [{ name: 'nonce', type: 'string' }]
        }
      ]
    });
  };

  const addWebAnalyticsConcept = () => {
    onAddConcept({
      id: 'Concept:WebAnalytics',
      name: 'WebAnalytics',
      stateFields: [],
      actions: [
        {
          name: 'register',
          kind: 'action',
          input: [
            { name: 'url', type: 'string' },
            { name: 'event', type: 'string' }
          ],
          output: []
        }
      ]
    });
  };

  const addExpiringResourceConcept = () => {
    onAddConcept({
      id: 'Concept:ExpiringResource',
      name: 'ExpiringResource',
      stateFields: [],
      actions: [
        {
          name: 'setExpiry',
          kind: 'action',
          input: [
            { name: 'resource', type: 'string' },
            { name: 'seconds', type: 'number' }
          ],
          output: []
        },
        {
          name: 'expireResource',
          kind: 'action',
          input: [{ name: 'resource', type: 'string' }],
          output: [{ name: 'resource', type: 'string' }]
        }
      ]
    });
  };

  const addWebConcept = () => {
    onAddConcept({
      id: 'Concept:Web',
      name: 'Web',
      stateFields: [],
      actions: [
        {
          name: 'request',
          kind: 'action',
          input: [
            { name: 'method', type: 'string' },
            { name: 'url', type: 'string', optional: true },
            { name: 'ip', type: 'string', optional: true }
          ],
          output: [
            { name: 'method', type: 'string' },
            { name: 'url', type: 'string', optional: true }
          ]
        },
        {
          name: 'redirect',
          kind: 'action',
          input: [{ name: 'url', type: 'string' }],
          output: []
        }
      ]
    });
  };

  // Upvotes concepts
  const addUpvoteConcept = () => {
    onAddConcept({
      id: 'Concept:Upvote',
      name: 'Upvote',
      stateFields: [
        { name: 'itemId', type: 'string' },
        { name: 'userId', type: 'string' },
        { name: 'count', type: 'number', init: '0' }
      ],
      actions: [
        {
          name: 'upvote',
          kind: 'action',
          input: [
            { name: 'itemId', type: 'string' },
            { name: 'userId', type: 'string' }
          ],
          output: [
            { name: 'itemId', type: 'string' },
            { name: 'author', type: 'string' }
          ]
        },
        {
          name: '_getVotes',
          kind: 'query',
          input: [{ name: 'itemId', type: 'string' }],
          output: [{ name: 'count', type: 'number' }, { name: 'timestamp', type: 'number' }]
        }
      ]
    });
  };

  const addRecommendationConcept = () => {
    onAddConcept({
      id: 'Concept:Recommendation',
      name: 'Recommendation',
      stateFields: [],
      actions: [
        {
          name: 'updateRanks',
          kind: 'action',
          input: [
            { name: 'itemId', type: 'string' },
            { name: 'score', type: 'number' }
          ],
          output: []
        }
      ]
    });
  };

  // Rate limiter concept
  const addRateLimiterConcept = () => {
    onAddConcept({
      id: 'Concept:RateLimiter',
      name: 'RateLimiter',
      stateFields: [
        { name: 'tokens', type: 'number', init: '10' },
        { name: 'lastRefill', type: 'number' }
      ],
      actions: [
        {
          name: 'check',
          kind: 'action',
          input: [{ name: 'ip', type: 'string' }],
          output: [{ name: 'allowed', type: 'boolean' }]
        },
        {
          name: '_status',
          kind: 'query',
          input: [{ name: 'ip', type: 'string' }],
          output: [{ name: 'tokensAvailable', type: 'number' }]
        }
      ]
    });
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-300 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Palette</h3>
      
      {/* Always show basic creation */}
      <div className="mb-4">
        <button 
          onClick={handleAddConcept}
          className="w-full mb-2 px-4 py-2 bg-[#6A89A7] text-white rounded hover:bg-[#384959]"
        >
          + Concept
        </button>
        <button 
          onClick={handleAddSync}
          className="w-full px-4 py-2 bg-[#384959] text-white rounded hover:bg-[#88BDF2] hover:text-[#384959]"
        >
          + Sync
        </button>
      </div>

      {/* Basic Demo - always show but collapsible */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('demos')}
          className="w-full flex justify-between items-center px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          <span>Basic Demo</span>
          <span>{expandedSections.demos ? '−' : '+'}</span>
        </button>
        {expandedSections.demos && (
          <div className="mt-2 space-y-1">
            <button 
              onClick={addPredefinedButton}
              className="w-full px-3 py-1 bg-[#BDDDFC] text-[#384959] rounded text-sm hover:bg-[#88BDF2]"
            >
              Button
            </button>
            <button 
              onClick={addPredefinedCounter}
              className="w-full px-3 py-1 bg-[#BDDDFC] text-[#384959] rounded text-sm hover:bg-[#88BDF2]"
            >
              Counter
            </button>
            <button 
              onClick={addPredefinedNotification}
              className="w-full px-3 py-1 bg-[#BDDDFC] text-[#384959] rounded text-sm hover:bg-[#88BDF2]"
            >
              Notification
            </button>
            <button 
              onClick={addPredefinedCounterNudge}
              className="w-full px-3 py-1 bg-[#384959] text-white rounded text-sm hover:bg-[#88BDF2] hover:text-[#384959]"
            >
              CounterNudge
            </button>
          </div>
        )}
      </div>

      {/* Show relevant demo sections only if needed or expanded */}
      {(hasUrlDemo || expandedSections.urlShortener) && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('urlShortener')}
            className="w-full flex justify-between items-center px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            <span>URL Shortener {hasUrlDemo ? '•' : ''}</span>
            <span>{expandedSections.urlShortener ? '−' : '+'}</span>
          </button>
          {expandedSections.urlShortener && (
            <div className="mt-2 space-y-1">
              <button onClick={addUrlShorteningConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">UrlShortening</button>
              <button onClick={addNonceGeneratorConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">NonceGenerator</button>
              <button onClick={addWebAnalyticsConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">WebAnalytics</button>
              <button onClick={addExpiringResourceConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">ExpiringResource</button>
              <button onClick={addWebConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">Web</button>
            </div>
          )}
        </div>
      )}

      {(hasUpvoteDemo || expandedSections.upvotes) && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('upvotes')}
            className="w-full flex justify-between items-center px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            <span>Upvotes Feed {hasUpvoteDemo ? '•' : ''}</span>
            <span>{expandedSections.upvotes ? '−' : '+'}</span>
          </button>
          {expandedSections.upvotes && (
            <div className="mt-2 space-y-1">
              <button onClick={addUpvoteConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">Upvote</button>
              <button onClick={addRecommendationConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">Recommendation</button>
            </div>
          )}
        </div>
      )}

      {(hasRateDemo || expandedSections.rateLimit) && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('rateLimit')}
            className="w-full flex justify-between items-center px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            <span>Rate Limit {hasRateDemo ? '•' : ''}</span>
            <span>{expandedSections.rateLimit ? '−' : '+'}</span>
          </button>
          {expandedSections.rateLimit && (
            <div className="mt-2 space-y-1">
              <button onClick={addRateLimiterConcept} className="w-full px-2 py-1 bg-[#BDDDFC] text-[#384959] rounded text-xs hover:bg-[#88BDF2]">RateLimiter</button>
            </div>
          )}
        </div>
      )}

      {/* Show expand buttons for unused sections */}
      {!hasUrlDemo && !expandedSections.urlShortener && (
        <button onClick={() => toggleSection('urlShortener')} className="w-full mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">+ URL Shortener</button>
      )}
      {!hasUpvoteDemo && !expandedSections.upvotes && (
        <button onClick={() => toggleSection('upvotes')} className="w-full mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">+ Upvotes Feed</button>
      )}
      {!hasRateDemo && !expandedSections.rateLimit && (
        <button onClick={() => toggleSection('rateLimit')} className="w-full mb-2 px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">+ Rate Limit</button>
      )}
    </div>
  );
};

export default Palette;
import { useState, useCallback } from 'react';
import { ComposerNode, ComposerEdge, ConceptData, SyncData, ComposerGraph } from '../types';

export function useComposerGraph() {
  const [nodes, setNodes] = useState<ComposerNode[]>([]);
  const [edges, setEdges] = useState<ComposerEdge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<ComposerNode[]>([]);

  const addConcept = useCallback((concept: ConceptData) => {
    const newNode: ComposerNode = {
      id: concept.id,
      type: 'concept',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { concept }
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const addSync = useCallback((sync: SyncData) => {
    const newNode: ComposerNode = {
      id: sync.id,
      type: 'sync',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { sync }
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const updateNode = useCallback((nodeId: string, data: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, data } : node
    ));
  }, []);

  const exportGraph = useCallback((): ComposerGraph => {
    const concepts: ConceptData[] = [];
    const syncs: SyncData[] = [];

    nodes.forEach(node => {
      if (node.type === 'concept') {
        concepts.push((node.data as any).concept);
      } else if (node.type === 'sync') {
        syncs.push((node.data as any).sync);
      }
    });

    const graphEdges = edges.map(edge => ({
      type: edge.sourceHandle?.includes('#then') ? 'then' as const : 'when' as const,
      from: `${edge.source}#${edge.sourceHandle?.split('#').slice(-1)[0] || 'output'}`,
      to: `${edge.target}#${edge.targetHandle?.split('#').slice(-1)[0] || 'input'}`
    }));

    return {
      concepts,
      syncs,
      edges: graphEdges
    };
  }, [nodes, edges]);

  const resetGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodes([]);
  }, []);

  const loadCompleteExample = useCallback(() => {
    // Create the demo nodes
    const buttonNode: ComposerNode = {
      id: 'Concept:Button',
      type: 'concept',
      position: { x: 100, y: 100 },
      data: { 
        concept: {
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
        }
      }
    };

    const counterNode: ComposerNode = {
      id: 'Concept:Counter',
      type: 'concept',
      position: { x: 600, y: 200 },
      data: {
        concept: {
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
        }
      }
    };

    const notificationNode: ComposerNode = {
      id: 'Concept:Notification',
      type: 'concept',
      position: { x: 600, y: 50 },
      data: {
        concept: {
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
        }
      }
    };

    const syncNode: ComposerNode = {
      id: 'Sync:CounterNudge',
      type: 'sync',
      position: { x: 350, y: 125 },
      data: {
        sync: {
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
        }
      }
    };

    // Create the edges to connect them
    const demoEdges: ComposerEdge[] = [
      {
        id: 'edge-1',
        source: 'Concept:Button',
        target: 'Sync:CounterNudge',
        sourceHandle: 'Concept:Button#clicked#output',
        targetHandle: 'Sync:CounterNudge#when',
        type: 'default',
        label: '→'
      },
      {
        id: 'edge-2', 
        source: 'Sync:CounterNudge',
        target: 'Concept:Counter',
        sourceHandle: 'Sync:CounterNudge#then',
        targetHandle: 'Concept:Counter#increment#input',
        type: 'default',
        label: '↗'
      },
      {
        id: 'edge-3',
        source: 'Sync:CounterNudge', 
        target: 'Concept:Notification',
        sourceHandle: 'Sync:CounterNudge#then',
        targetHandle: 'Concept:Notification#notify#input',
        type: 'default',
        label: '↗'
      }
    ];

    setNodes([buttonNode, counterNode, notificationNode, syncNode]);
    setEdges(demoEdges);
    setSelectedNodes([]);
  }, []);

  const loadUrlShortenerDemo = useCallback(() => {
    resetGraph();
    // Create a simplified URL shortener demo with key concepts
    const webNode: ComposerNode = {
      id: 'Concept:Web',
      type: 'concept', 
      position: { x: 50, y: 100 },
      data: {
        concept: {
          id: 'Concept:Web',
          name: 'Web',
          stateFields: [],
          actions: [
            {
              name: 'request',
              kind: 'action',
              input: [{ name: 'method', type: 'string' }, { name: 'url', type: 'string', optional: true }],
              output: [{ name: 'method', type: 'string' }, { name: 'url', type: 'string', optional: true }]
            }
          ]
        }
      }
    };

    const nonceNode: ComposerNode = {
      id: 'Concept:NonceGenerator',
      type: 'concept',
      position: { x: 300, y: 50 },
      data: {
        concept: {
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
        }
      }
    };

    const urlShorteningNode: ComposerNode = {
      id: 'Concept:UrlShortening',
      type: 'concept',
      position: { x: 550, y: 100 },
      data: {
        concept: {
          id: 'Concept:UrlShortening',
          name: 'UrlShortening', 
          stateFields: [],
          actions: [
            {
              name: 'register',
              kind: 'action',
              input: [{ name: 'shortUrl', type: 'string' }, { name: 'longUrl', type: 'string' }],
              output: [{ name: 'shortUrl', type: 'string' }]
            }
          ]
        }
      }
    };

    const shortenSync: ComposerNode = {
      id: 'Sync:ShortenUrlSync',
      type: 'sync',
      position: { x: 300, y: 200 },
      data: {
        sync: {
          id: 'Sync:ShortenUrlSync',
          name: 'ShortenUrlSync',
          vars: ['longUrl', 'shortUrl'],
          when: [
            {
              conceptId: 'Concept:Web',
              action: 'request',
              inputBindings: { method: 'shortenUrl' },
              outputBindings: {}
            }
          ],
          where: [],
          then: [
            {
              conceptId: 'Concept:NonceGenerator',
              action: 'generate', 
              inputBindings: {}
            },
            {
              conceptId: 'Concept:UrlShortening',
              action: 'register',
              inputBindings: {}
            }
          ]
        }
      }
    };

    const demoEdges: ComposerEdge[] = [
      {
        id: 'url-edge-1',
        source: 'Concept:Web',
        target: 'Sync:ShortenUrlSync',
        sourceHandle: 'Concept:Web#request#output',
        targetHandle: 'Sync:ShortenUrlSync#when',
        type: 'default',
        label: '→'
      },
      {
        id: 'url-edge-2',
        source: 'Sync:ShortenUrlSync',
        target: 'Concept:NonceGenerator', 
        sourceHandle: 'Sync:ShortenUrlSync#then',
        targetHandle: 'Concept:NonceGenerator#generate#input',
        type: 'default',
        label: '↗'
      },
      {
        id: 'url-edge-3',
        source: 'Sync:ShortenUrlSync',
        target: 'Concept:UrlShortening',
        sourceHandle: 'Sync:ShortenUrlSync#then',
        targetHandle: 'Concept:UrlShortening#register#input',
        type: 'default',
        label: '↗'
      }
    ];

    setNodes([webNode, nonceNode, urlShorteningNode, shortenSync]);
    setEdges(demoEdges);
    setSelectedNodes([]);
  }, [resetGraph]);

  const loadUpvotesDemo = useCallback(() => {
    resetGraph();
    const upvoteNode: ComposerNode = {
      id: 'Concept:Upvote',
      type: 'concept',
      position: { x: 100, y: 100 },
      data: {
        concept: {
          id: 'Concept:Upvote',
          name: 'Upvote',
          stateFields: [{ name: 'count', type: 'number', init: '0' }],
          actions: [
            {
              name: 'upvote',
              kind: 'action',
              input: [{ name: 'itemId', type: 'string' }, { name: 'userId', type: 'string' }],
              output: [{ name: 'itemId', type: 'string' }, { name: 'author', type: 'string' }]
            }
          ]
        }
      }
    };

    const notificationNode: ComposerNode = {
      id: 'Concept:Notification',
      type: 'concept', 
      position: { x: 500, y: 50 },
      data: {
        concept: {
          id: 'Concept:Notification',
          name: 'Notification',
          stateFields: [],
          actions: [
            {
              name: 'notify',
              kind: 'action',
              input: [{ name: 'author', type: 'string' }],
              output: []
            }
          ]
        }
      }
    };

    const recommendationNode: ComposerNode = {
      id: 'Concept:Recommendation',
      type: 'concept',
      position: { x: 500, y: 150 },
      data: {
        concept: {
          id: 'Concept:Recommendation',
          name: 'Recommendation',
          stateFields: [],
          actions: [
            {
              name: 'updateRanks',
              kind: 'action',
              input: [{ name: 'itemId', type: 'string' }, { name: 'score', type: 'number' }],
              output: []
            }
          ]
        }
      }
    };

    const upvoteSync: ComposerNode = {
      id: 'Sync:UpvoteSync',
      type: 'sync',
      position: { x: 300, y: 125 },
      data: {
        sync: {
          id: 'Sync:UpvoteSync',
          name: 'UpvoteSync',
          vars: ['author', 'itemId'],
          when: [
            {
              conceptId: 'Concept:Upvote',
              action: 'upvote',
              inputBindings: {},
              outputBindings: { author: 'author', itemId: 'itemId' }
            }
          ],
          where: [],
          then: [
            {
              conceptId: 'Concept:Notification',
              action: 'notify',
              inputBindings: { author: 'author' }
            },
            {
              conceptId: 'Concept:Recommendation', 
              action: 'updateRanks',
              inputBindings: { itemId: 'itemId' }
            }
          ]
        }
      }
    };

    const demoEdges: ComposerEdge[] = [
      {
        id: 'upvote-edge-1',
        source: 'Concept:Upvote',
        target: 'Sync:UpvoteSync',
        sourceHandle: 'Concept:Upvote#upvote#output',
        targetHandle: 'Sync:UpvoteSync#when',
        type: 'default',
        label: '→'
      },
      {
        id: 'upvote-edge-2',
        source: 'Sync:UpvoteSync',
        target: 'Concept:Notification',
        sourceHandle: 'Sync:UpvoteSync#then',
        targetHandle: 'Concept:Notification#notify#input',
        type: 'default',
        label: '↗'
      },
      {
        id: 'upvote-edge-3',
        source: 'Sync:UpvoteSync',
        target: 'Concept:Recommendation',
        sourceHandle: 'Sync:UpvoteSync#then',
        targetHandle: 'Concept:Recommendation#updateRanks#input',
        type: 'default',
        label: '↗'
      }
    ];

    setNodes([upvoteNode, notificationNode, recommendationNode, upvoteSync]);
    setEdges(demoEdges);
    setSelectedNodes([]);
  }, [resetGraph]);

  const loadRateLimitDemo = useCallback(() => {
    resetGraph();
    const webNode: ComposerNode = {
      id: 'Concept:Web',
      type: 'concept',
      position: { x: 100, y: 100 },
      data: {
        concept: {
          id: 'Concept:Web',
          name: 'Web',
          stateFields: [],
          actions: [
            {
              name: 'request',
              kind: 'action',
              input: [{ name: 'method', type: 'string' }, { name: 'ip', type: 'string' }],
              output: [{ name: 'ip', type: 'string' }]
            }
          ]
        }
      }
    };

    const rateLimiterNode: ComposerNode = {
      id: 'Concept:RateLimiter',
      type: 'concept',
      position: { x: 500, y: 50 },
      data: {
        concept: {
          id: 'Concept:RateLimiter',
          name: 'RateLimiter',
          stateFields: [{ name: 'tokens', type: 'number', init: '10' }],
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
        }
      }
    };

    const notificationNode: ComposerNode = {
      id: 'Concept:Notification',
      type: 'concept',
      position: { x: 500, y: 200 },
      data: {
        concept: {
          id: 'Concept:Notification',
          name: 'Notification',
          stateFields: [],
          actions: [
            {
              name: 'notify',
              kind: 'action',
              input: [{ name: 'message', type: 'string' }],
              output: []
            }
          ]
        }
      }
    };

    const rateLimitSync: ComposerNode = {
      id: 'Sync:RateLimitSync',
      type: 'sync',
      position: { x: 300, y: 125 },
      data: {
        sync: {
          id: 'Sync:RateLimitSync',
          name: 'RateLimitSync',
          vars: ['ip', 'tokensAvailable'],
          when: [
            {
              conceptId: 'Concept:Web',
              action: 'request',
              inputBindings: { method: 'contact' },
              outputBindings: { ip: 'ip' }
            }
          ],
          where: [
            {
              op: 'query',
              conceptId: 'Concept:RateLimiter',
              method: '_status',
              input: { ip: 'ip' },
              outputBindings: { tokensAvailable: 'tokensAvailable' }
            },
            {
              op: 'filter',
              expr: 'tokensAvailable > 0'
            }
          ],
          then: [
            {
              conceptId: 'Concept:RateLimiter',
              action: 'check',
              inputBindings: { ip: 'ip' }
            },
            {
              conceptId: 'Concept:Notification',
              action: 'notify',
              inputBindings: { message: 'allowed ? "received" : "rate limited"' }
            }
          ]
        }
      }
    };

    const demoEdges: ComposerEdge[] = [
      {
        id: 'rate-edge-1',
        source: 'Concept:Web',
        target: 'Sync:RateLimitSync',
        sourceHandle: 'Concept:Web#request#output',
        targetHandle: 'Sync:RateLimitSync#when',
        type: 'default',
        label: '→'
      },
      {
        id: 'rate-edge-2',
        source: 'Sync:RateLimitSync',
        target: 'Concept:RateLimiter',
        sourceHandle: 'Sync:RateLimitSync#then',
        targetHandle: 'Concept:RateLimiter#check#input',
        type: 'default',
        label: '↗'
      },
      {
        id: 'rate-edge-3',
        source: 'Sync:RateLimitSync',
        target: 'Concept:Notification',
        sourceHandle: 'Sync:RateLimitSync#then',
        targetHandle: 'Concept:Notification#notify#input',
        type: 'default',
        label: '↗'
      }
    ];

    setNodes([webNode, rateLimiterNode, notificationNode, rateLimitSync]);
    setEdges(demoEdges);
    setSelectedNodes([]);
  }, [resetGraph]);

  return {
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
  };
}
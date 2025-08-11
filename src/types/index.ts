import { Node, Edge } from '@xyflow/react';

export interface ActionField {
  name: string;
  type: string;
  optional?: boolean;
}

export interface Action {
  name: string;
  kind: 'action' | 'query';
  input: ActionField[];
  output: ActionField[];
}

export interface StateField {
  name: string;
  type: string;
  init?: string;
}

export interface ConceptData {
  id: string;
  name: string;
  stateFields: StateField[];
  actions: Action[];
}

export interface ActionPattern {
  conceptId: string;
  action: string;
  inputBindings: Record<string, string>;
  outputBindings?: Record<string, string>;
}

export interface WhereStep {
  op: 'query' | 'queryAsync' | 'filter' | 'map';
  conceptId?: string;
  method?: string;
  input?: Record<string, string>;
  outputBindings?: Record<string, string>;
  expr?: string;
}

export interface SyncData {
  id: string;
  name: string;
  vars: string[];
  when: ActionPattern[];
  where: WhereStep[];
  then: ActionPattern[];
}

export interface GraphEdge {
  type: 'when' | 'then';
  from: string;
  to: string;
}

export interface ComposerGraph {
  concepts: ConceptData[];
  syncs: SyncData[];
  edges: GraphEdge[];
}

export interface ConceptNodeData {
  concept: ConceptData;
}

export interface SyncNodeData {
  sync: SyncData;
}

export type ConceptNode = Node<ConceptNodeData, 'concept'>;
export type SyncNode = Node<SyncNodeData, 'sync'>;
export type ComposerNode = ConceptNode | SyncNode;
export type ComposerEdge = Edge;
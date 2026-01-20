import { NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';
import { Node } from '@tiptap/core';
import { Excalidraw } from '@excalidraw/excalidraw';
import React, { useState } from 'react';

interface DiagramData {
  elements?: any[];
  appState?: any;
}

// The React Component that renders the diagram
const DiagramComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <NodeViewWrapper className="kine-diagram-block my-8">
      <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px] relative bg-white shadow-sm hover:shadow-md transition-shadow">
        
        <Excalidraw
          initialData={node.attrs.data || null}
          onChange={(elements: readonly any[], state: any) => {
            updateAttributes({ data: { elements: [...elements], appState: state } });
          }}
          UIOptions={{ canvasActions: { loadScene: false } }}
        />

        {!isEditing && (
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
            onClick={() => setIsEditing(true)} 
          />
        )}
      </div>
      <div className="text-center text-xs text-gray-400 mt-2">
        Interactive Diagram • Click to Edit
      </div>
    </NodeViewWrapper>
  );
};

// The Tiptap Node Definition
export const DiagramNode = Node.create({
  name: 'diagram',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      data: {
        default: null as DiagramData | null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'kine-diagram' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['kine-diagram', HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiagramComponent);
  },
});

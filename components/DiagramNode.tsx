import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node } from '@tiptap/core';
import { Excalidraw } from '@excalidraw/excalidraw';
import React, { useState } from 'react';

// 1. The React Component that renders the diagram
const DiagramComponent = ({ node, updateAttributes }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <NodeViewWrapper className="kine-diagram-block my-8">
      {/* Container with a border to look like a 'card' in the doc */}
      <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px] relative bg-white shadow-sm hover:shadow-md transition-shadow">
        
        {/* The Excalidraw Canvas */}
        <Excalidraw
          initialData={node.attrs.data || null}
          onChange={(elements, state) => {
            // Save state back to the document JSON
            // We use a debounce here in production to prevent lag
             updateAttributes({ data: { elements, appState: state } });
          }}
          UIOptions={{ canvasActions: { loadScene: false } }} // Hide clutter
        />

        {/* Overlay to prevent accidental clicks while scrolling */}
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

// 2. The Tiptap Node Definition
export const DiagramNode = Node.create({
  name: 'diagram',
  group: 'block',
  atom: true, // It is a single unit, not text

  addAttributes() {
    return {
      data: {
        default: null,
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

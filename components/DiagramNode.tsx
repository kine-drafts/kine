import { NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react';
import { Node } from '@tiptap/core';
import { Excalidraw } from '@excalidraw/excalidraw';
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw';
import React, { useState, useEffect } from 'react';

interface DiagramData {
  elements?: any[];
  appState?: any;
}

// The React Component that renders the diagram
const DiagramComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const prompt = node.attrs.prompt || '';

  useEffect(() => {
    // Auto-generate when component is first created with a prompt
    if (prompt && !hasGenerated) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const { mermaid } = await response.json();
      
      // Convert Mermaid to Excalidraw elements
      const { elements } = await parseMermaidToExcalidraw(mermaid, {
        fontSize: 16,
      });
      
      updateAttributes({ data: { elements, appState: {} } });
      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating diagram:', error);
      alert('Failed to generate diagram. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <NodeViewWrapper className="kine-diagram-block my-8">
      {/* Show the prompt that was used */}
      {prompt && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium text-blue-700">Diagram prompt:</span>
              <p className="text-sm text-blue-900 mt-1">{prompt}</p>
            </div>
            {!isGenerating && (
              <button
                onClick={handleGenerate}
                className="ml-4 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Regenerate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Excalidraw canvas */}
      <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px] relative bg-white shadow-sm hover:shadow-md transition-shadow">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Generating diagram...</p>
            </div>
          </div>
        ) : (
          <>
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
          </>
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
      prompt: {
        default: '',
      },
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

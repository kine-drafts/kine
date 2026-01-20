'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Plus } from 'lucide-react';

export default function Home() {
  const [DiagramNode, setDiagramNode] = useState<any>(null);

  useEffect(() => {
    // Import DiagramNode only on client-side
    import('@/components/DiagramNode').then((mod) => {
      setDiagramNode(mod.DiagramNode);
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ...(DiagramNode ? [DiagramNode] : []),
    ],
    content: `
      <h2>Welcome to Kine.</h2>
      <p>This is a text-based diagramming tool. Type anywhere to write text.</p>
      <p>Select any text, then click "Insert Diagram" to generate a diagram based on your selection.</p>
      <p>Try selecting this: user authentication flow with login, registration, and password reset</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[50vh]',
      },
    },
  }, [DiagramNode]);

  const addDiagram = () => {
    if (!editor) return;
    
    // Get the selected text
    const { from, to, empty } = editor.state.selection;
    
    if (empty) {
      alert('Please select some text first to describe what diagram you want to generate.');
      return;
    }
    
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    
    if (!selectedText.trim()) {
      alert('Please select some text first to describe what diagram you want to generate.');
      return;
    }

    // Insert diagram at the end of the selection WITHOUT deleting the text
    const insertPos = to;
    
    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, [
        { type: 'paragraph' },
        { type: 'diagram', attrs: { prompt: selectedText } },
        { type: 'paragraph' },
      ])
      .run();
  };

  if (!editor) return null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[80vh] flex flex-col">
        
        {/* Toolbar */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 p-4 flex gap-2 items-center sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur z-20 rounded-t-xl">
          <div className="flex gap-1 text-sm font-medium text-zinc-500">
             <span className="text-black dark:text-white font-bold tracking-tight mr-2">Kine</span>
             <span>/ Untitled</span>
          </div>
          <div className="flex-1" />
          <button 
            onClick={addDiagram}
            className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Plus size={16} />
            Insert Diagram
          </button>
        </div>

        {/* Editor Area */}
        <div className="p-8 md:p-12">
          <EditorContent editor={editor} />
        </div>

      </div>
    </main>
  );
}

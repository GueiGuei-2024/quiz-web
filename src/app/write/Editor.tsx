"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import React from "react";

export default function Editor({ onSubmit }: { onSubmit: (content: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>開始寫文章吧...</p>",
  });

  const handleSave = () => {
    const html = editor?.getHTML();
    if (html) onSubmit(html);
  };

  const addImage = () => {
    const url = window.prompt("輸入圖片網址：");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded shadow text-black">
      {/* 工具列 */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="btn">粗體</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn">斜體</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="btn">清單</button>
        <button onClick={addImage} className="btn">插入圖片</button>
      </div>

      {/* 編輯區域 */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] outline-none prose max-w-none"
      />

      {/* 發布按鈕 */}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        發布
      </button>

      <style jsx>{`
        .btn {
          @apply px-2 py-1 border rounded hover:bg-gray-100;
        }

        /* 防止 dark mode 影響（字白背景黑） */
        .prose {
          color: #111;
          background-color: #fff;
        }

        .ProseMirror {
          outline: none;
        }
      `}</style>
    </div>
  );
}

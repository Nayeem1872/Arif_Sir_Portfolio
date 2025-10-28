"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
}: RichTextEditorProps) => {
  const quillRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill").then((Quill) => {
        if (containerRef.current && !quillRef.current) {
          quillRef.current = new Quill.default(containerRef.current, {
            theme: "snow",
            placeholder,
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["link", "image"],
                [{ align: [] }],
                ["code-block"],
                ["clean"],
              ],
            },
            formats: [
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "align",
              "code-block",
            ],
          });

          // Set initial value
          if (value) {
            quillRef.current.root.innerHTML = value;
          }

          // Listen for text changes
          quillRef.current.on("text-change", () => {
            const html = quillRef.current.root.innerHTML;
            onChange(html);
          });
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      className={`quill-dark-theme bg-secondary/40 border-border rounded-md border ${className}`}
    >
      <div ref={containerRef} style={{ minHeight: "200px" }} />
      <style jsx global>{`
        .quill-dark-theme .ql-toolbar {
          background: rgb(30 41 59 / 0.4);
          border-color: rgb(71 85 105 / 0.3);
          border-bottom: 1px solid rgb(71 85 105 / 0.3);
        }

        .quill-dark-theme .ql-toolbar .ql-stroke {
          stroke: rgb(148 163 184);
        }

        .quill-dark-theme .ql-toolbar .ql-fill {
          fill: rgb(148 163 184);
        }

        .quill-dark-theme .ql-toolbar .ql-picker-label {
          color: rgb(148 163 184);
        }

        .quill-dark-theme .ql-toolbar .ql-picker-options {
          background: rgb(30 41 59);
          border-color: rgb(71 85 105 / 0.3);
        }

        .quill-dark-theme .ql-toolbar .ql-picker-item:hover {
          background: rgb(51 65 85);
        }

        .quill-dark-theme .ql-toolbar button:hover {
          background: rgb(51 65 85 / 0.5);
        }

        .quill-dark-theme .ql-toolbar button.ql-active {
          background: rgb(59 130 246 / 0.2);
        }

        .quill-dark-theme .ql-container {
          background: rgb(30 41 59 / 0.4);
          border-color: rgb(71 85 105 / 0.3);
          color: rgb(248 250 252);
        }

        .quill-dark-theme .ql-editor {
          color: rgb(248 250 252);
        }

        .quill-dark-theme .ql-editor.ql-blank::before {
          color: rgb(148 163 184);
        }

        .quill-dark-theme .ql-editor h1,
        .quill-dark-theme .ql-editor h2,
        .quill-dark-theme .ql-editor h3 {
          color: rgb(248 250 252);
        }

        .quill-dark-theme .ql-editor a {
          color: rgb(96 165 250);
        }

        .quill-dark-theme .ql-editor blockquote {
          border-left-color: rgb(71 85 105);
          color: rgb(203 213 225);
        }

        .quill-dark-theme .ql-editor pre {
          background: rgb(15 23 42);
          color: rgb(226 232 240);
          border: 1px solid rgb(71 85 105 / 0.3);
        }

        .quill-dark-theme .ql-snow .ql-tooltip {
          background: rgb(30 41 59);
          border: 1px solid rgb(71 85 105 / 0.3);
          color: rgb(248 250 252);
        }

        .quill-dark-theme .ql-snow .ql-tooltip input {
          background: rgb(51 65 85);
          border: 1px solid rgb(71 85 105 / 0.3);
          color: rgb(248 250 252);
        }

        .quill-dark-theme .ql-snow .ql-tooltip a {
          color: rgb(96 165 250);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Markdown() {
  const fullResponseText =
    "Here is a complete, working example.\n\nThis solution uses:\n1.  **`react-markdown`** to render the Markdown.\n2.  **`react-syntax-highlighter`** to colorize the code blocks.\n3.  **`navigator.clipboard`** (native browser API) to handle the copying functionality without extra dependencies.\n\n### Prerequisites\n\nYou will need to install these packages:\n\n```bash\nnpm install react-markdown react-syntax-highlighter\n```\n\n### The Code\n\nCreate a file (e.g., `MarkdownViewer.jsx`) and paste the following code. This component intercepts the standard `<code>` blocks, adds syntax highlighting, and places a \"Copy\" button in the top-right corner of the block.\n\n```jsx\nimport React, { useState } from 'react';\nimport ReactMarkdown from 'react-markdown';\nimport { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';\nimport { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';\n\nconst MarkdownViewer = () => {\n  const markdownContent = `\n# Here is some JavaScript code\n\n\\`\\`\\`javascript\nconst greet = (name) => {\n  console.log(\"Hello, \" + name);\n  return true;\n};\n\\`\\`\\`\n\n# Here is some Python code\n\n\\`\\`\\`python\ndef greet(name):\n    print(f\"Hello, {name}\")\n    return True\n\\`\\`\\`\n  `;\n\n  return (\n    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>\n      <ReactMarkdown\n        components={{\n          code({ node, inline, className, children, ...props }) {\n            const match = /language-(\\w+)/.exec(className || '');\n\n            return !inline && match ? (\n              <CodeBlock\n                codestring={String(children).replace(/\\n$/, '')}\n                language={match[1]}\n              />\n            ) : (\n              <code className={className} {...props}>\n                {children}\n              </code>\n            );\n          },\n        }}\n      >\n        {markdownContent}\n      </ReactMarkdown>\n    </div>\n  );\n};\n\n// Internal component for the code block with copy button\nconst CodeBlock = ({ language, codestring }) => {\n  const [copied, setCopied] = useState(false);\n\n  const handleCopy = () => {\n    navigator.clipboard.writeText(codestring);\n    setCopied(true);\n    setTimeout(() => setCopied(false), 2000); // Reset button text after 2 seconds\n  };\n\n  return (\n    <div className=\"code-block-wrapper\" style={{ position: 'relative', margin: '1rem 0' }}>\n      {/* Copy Button */}\n      <button\n        onClick={handleCopy}\n        style={{\n          position: 'absolute',\n          top: '5px',\n          right: '5px',\n          zIndex: 10,\n          padding: '5px 10px',\n          background: '#444',\n          color: '#fff',\n          border: 'none',\n          borderRadius: '4px',\n          cursor: 'pointer',\n          fontSize: '12px',\n        }}\n      >\n        {copied ? 'Copied!' : 'Copy'}\n      </button>\n\n      {/* Syntax Highlighter */}\n      <SyntaxHighlighter\n        language={language}\n        style={vscDarkPlus}\n        customStyle={{ margin: 0, padding: '25px 20px 20px' }} // Add padding to top to avoid overlap with button\n        PreTag=\"div\"\n      >\n        {codestring}\n      </SyntaxHighlighter>\n    </div>\n  );\n};\n\nexport default MarkdownViewer;\n```\n\n### How it works\n\n1.  **Custom Renderer**: We pass a `components` object to `<ReactMarkdown>`. Specifically, we override the `code` component.\n2.  **Detection**: Inside the `code` function, we check `!inline && match`.\n    *   **Inline code** (like `const x`) is rendered as a standard `<code>` tag.\n    *   **Block code** (wrapped in triple backticks) is rendered using our custom `<CodeBlock />` component.\n3.  **Positioning**: The `<CodeBlock />` wrapper has `position: relative`. The copy button has `position: absolute`, placing it in the top-right corner over the code.\n4.  **Clipboard Logic**: We use `navigator.clipboard.writeText(codestring)` to copy the text.\n5.  **Feedback**: We use a standard `useState` boolean to change the button text from \"Copy\" to \"Copied!\" for 2 seconds after clicking.";
    
  return (
    <>
      <div className="flex flex-col h-full">
        <h2 className="m-auto flex-none">Markdown</h2>
        <div className="max-w-[1000px] m-auto flex-none mt-[20px]">
          This is an example showing how Markdown text can be rendered and styled using React.
        </div>
        <div className="special-flex max-w-[1000px] m-auto h-full overflow-y-scroll mt-[20px] mb-[40px]">
          <ReactMarkdown
            components={{
              pre: ({ children }) => <>{children}</>,
              code(props) {
                const { children, className, node, ref, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const codeText = String(children).replace(/\n$/, "");

                return match ? (
                  <>
                    <div
                      className="flex mt-[10px]"
                      style={{
                        background: "rgb(30, 30, 30)",
                        color: "#fff",
                        padding: "1em 1em 0 1em",
                      }}
                    >
                      <div className="inline-block text-left w-full">
                        {match[1]}
                      </div>
                      <div className="inline-block text-right w-full ">
                        <button
                          type="button"
                          className="btn"
                          onClick={(e) => {
                            const button = e.target as HTMLElement;
                            navigator.clipboard.writeText(codeText);
                            button.innerHTML = "Copied";
                            setTimeout(() => {
                              button.innerHTML = "Copy";
                            }, 1000);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <SyntaxHighlighter
                      {...rest}
                      children={codeText}
                      language={match[1]}
                      style={vscDarkPlus}
                      PreTag="div"
                      customStyle={{ marginTop: "0px", paddingTop: "0px" }}
                    />
                  </>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {fullResponseText}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}

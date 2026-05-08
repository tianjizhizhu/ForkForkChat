import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, GitBranch, Check, User, Bot, ChevronRight } from 'lucide-react';
import { Message as MessageType } from '../types';
import { useConversationStore } from '../stores/conversationStore';
import clsx from 'clsx';

interface MessageProps {
  message: MessageType;
  onCreateBranch: (messageId: string) => void;
  onToggleBranch: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onCreateBranch, onToggleBranch }) => {
  const [copied, setCopied] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { branches, activeBranchId } = useConversationStore();
  
  const branch = branches[message.id];
  const hasBranch = !!branch;
  const isBranchActive = hasBranch && activeBranchId === message.id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'flex gap-4 p-4 md:p-5 rounded-2xl animate-fadeIn shadow-sm',
        message.role === 'user' ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-white/80 backdrop-blur-md border border-gray-100',
        isBranchActive && 'border-r-4 border-r-indigo-400'
      )}
    >
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md',
          message.role === 'user'
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        )}
      >
        {message.role === 'user' ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-800">
            {message.role === 'user' ? '你' : 'AI助手'}
          </span>
          {message.role === 'system' && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
              分支同步
            </span>
          )}
        </div>

        <div ref={contentRef} className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;

                if (isInline) {
                  return (
                    <code
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="my-3 rounded-xl overflow-hidden border border-gray-200">
                    {match && (
                      <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 text-xs font-mono">
                        {match[1]}
                      </div>
                    )}
                    <pre className="p-4 bg-gray-900 overflow-x-auto">
                      <code className="text-sm text-gray-100 font-mono">{children}</code>
                    </pre>
                  </div>
                );
              },
              p({ children }) {
                return <p className="text-gray-700 leading-relaxed mb-3 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside text-gray-700 space-y-1 mb-3">{children}</ol>;
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                  >
                    {children}
                  </a>
                );
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-3">
                    {children}
                  </blockquote>
                );
              },
              h1({ children }) {
                return <h1 className="text-xl font-bold text-gray-800 mb-3 mt-4">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="text-lg font-bold text-gray-800 mb-2 mt-3">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-base font-semibold text-gray-800 mb-2 mt-2">{children}</h3>;
              },
              strong({ children }) {
                return <strong className="font-semibold text-gray-800">{children}</strong>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制</span>
                </>
              )}
            </button>
            {hasBranch ? (
              <button
                onClick={() => onToggleBranch(message.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-200',
                  isBranchActive
                    ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                    : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                )}
              >
                <ChevronRight className={clsx('w-3.5 h-3.5 transition-transform duration-200', isBranchActive && 'rotate-90')} />
                <span>{isBranchActive ? '收起分支' : '查看分支'}</span>
                {branch.isSynced && (
                  <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs rounded-full font-medium">已同步</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => onCreateBranch(message.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>创建分支</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

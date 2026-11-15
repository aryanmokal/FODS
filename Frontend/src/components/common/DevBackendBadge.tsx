import React, { useState } from 'react';
import { Server, Database, Code, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { isMockMode, getApiBaseUrl } from '../../services/api/apiClient';
import { mockStorage } from '../../services/mock/mockStorage';
import { Modal } from './Modal';

export const DevBackendBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mockActive = isMockMode();
  const baseUrl = getApiBaseUrl();

  const handleResetData = () => {
    mockStorage.resetData();
    window.location.reload();
  };

  return (
    <>
      <button
        id="dev-backend-badge-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 sm:bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-800/90 text-zinc-200 text-xs font-mono backdrop-blur-md border border-zinc-700/60 shadow-lg hover:bg-zinc-800 transition-all hover:scale-105"
        title="View Backend Integration Info"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-sans font-medium text-xs">
          {mockActive ? 'Mock Data Mode' : 'FastAPI Connected'}
        </span>
        <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="InstaDS Frontend Architecture & Backend Guide"
        maxWidth="lg"
      >
        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-sm">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-500" /> Current Mode:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {mockActive ? 'Client-Side Mock Services' : 'Connected to FastAPI'}
              </span>
            </div>
            {baseUrl && (
              <p className="mt-2 text-xs font-mono text-zinc-500 break-all">
                Base URL: {baseUrl}
              </p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-1.5 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-500" /> How to Connect Your Python FastAPI Backend
            </h4>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              This frontend is 100% decoupled from the backend. When your FastAPI + PostgreSQL backend is ready:
            </p>
            <ol className="mt-2 space-y-1.5 text-xs list-decimal list-inside text-zinc-600 dark:text-zinc-300">
              <li>Set <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">VITE_API_BASE_URL="http://localhost:8000/api/v1"</code> in <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">.env</code></li>
              <li>Ensure your FastAPI CORS middleware allows frontend requests.</li>
              <li>Implement the REST endpoints matching <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">src/services/api/*</code>.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-1.5 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" /> Ready Endpoints Contract
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-900 text-zinc-200 p-3 rounded-xl max-h-36 overflow-y-auto">
              <div>POST /auth/login</div>
              <div>POST /auth/register</div>
              <div>GET /posts</div>
              <div>POST /posts</div>
              <div>POST /posts/:id/like</div>
              <div>POST /posts/:id/save</div>
              <div>GET /posts/:id/comments</div>
              <div>POST /posts/:id/comments</div>
              <div>GET /users/:username</div>
              <div>PUT /users/me</div>
              <div>POST /users/:id/follow</div>
              <div>GET /explore</div>
              <div>GET /notifications</div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <button
              id="reset-mock-data-btn"
              onClick={handleResetData}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium underline"
            >
              Reset Sample Demo Data
            </button>
            <button
              id="dev-modal-done-btn"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

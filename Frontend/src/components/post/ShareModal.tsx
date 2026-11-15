import React, { useState } from 'react';
import { Copy, Check, Share2, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Post } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/#post-${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Post" maxWidth="sm">
      <div className="space-y-4 text-zinc-800 dark:text-zinc-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <img
            src={post.imageUrl}
            alt="Preview"
            referrerPolicy="no-referrer"
            className="w-12 h-12 object-cover rounded-lg shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate">@{post.author.username}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{post.caption}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-500">Post Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 select-all font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

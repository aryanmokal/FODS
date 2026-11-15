import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopHeader } from './TopHeader';
import { DevBackendBadge } from '../common/DevBackendBadge';
import { CreatePostModal } from '../post/CreatePostModal';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const isAuthRoute =
    location.pathname === '/login' || location.pathname === '/register';

  if (isAuthRoute) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center">
        <Outlet />
        <DevBackendBadge />
      </main>
    );
  }

  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  return (
    <div id="app-root-layout" className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
      {/* Desktop Sidebar */}
      <Sidebar onOpenCreateModal={handleOpenCreateModal} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <TopHeader />
        <main className="flex-1 flex justify-center w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
          <Outlet context={{ onOpenCreateModal: handleOpenCreateModal }} />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenCreateModal={handleOpenCreateModal} />

      {/* Create Post Modal Dialog */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          setIsCreateModalOpen(false);
        }}
      />

      {/* Dev FastAPI Architecture Badge */}
      <DevBackendBadge />
    </div>
  );
};

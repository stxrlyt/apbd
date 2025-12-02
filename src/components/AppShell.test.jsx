import React, { useState, useMemo } from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import { useAuth } from '../contexts/AuthContext';

// Mock the AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the permissions module
vi.mock('../utils/permissions', () => ({
  canCreateDraft: vi.fn((role) => role === 'admin' || role === 'secretary'),
  canApproveDraft: vi.fn((role) => 
    role === 'admin' || role === 'secretary' || role === 'kades'
  ),
}));

const renderAppShell = (authContextValue) => {
  useAuth.mockReturnValue(authContextValue);
  
  return render(
    <BrowserRouter>
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    </BrowserRouter>
  );
};

describe('AppShell', () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the app title', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('APBDes')).toBeInTheDocument();
  });

  it('should display user information', () => {
    renderAppShell({
      userData: { displayName: 'John Doe', email: 'john@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should display role with capitalized first letter', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Draft')).toBeInTheDocument();
    expect(screen.getByText('Approval')).toBeInTheDocument();
    expect(screen.getByText('Revisions')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('should show Create Draft link for admin role', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('Create Draft')).toBeInTheDocument();
  });

  it('should show Create Draft link for secretary role', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'secretary',
    });

    expect(screen.getByText('Create Draft')).toBeInTheDocument();
  });

  it('should not show Create Draft link for kades role', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'kades',
    });

    expect(screen.queryByText('Create Draft')).not.toBeInTheDocument();
  });

  it('should show Approval link for roles with approval permission', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'kades',
    });

    expect(screen.getByText('Approval')).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render sign out button', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('should handle missing userData gracefully', () => {
    renderAppShell({
      userData: null,
      signOut: mockSignOut,
      role: 'admin',
    });

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should handle missing role gracefully', () => {
    renderAppShell({
      userData: { displayName: 'Test User', email: 'test@example.com' },
      signOut: mockSignOut,
      role: null,
    });

    expect(screen.getByText('User')).toBeInTheDocument();
  });
});


import React from 'react';
import AdminBlogPanel from '@/components/admin/AdminBlogPanel';

export const metadata = {
  title: 'Administrar Blog | KROKOWEB',
  description: 'Panel de administración del blog',
};

export default function AdminBlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración del Blog</h1>
      <AdminBlogPanel />
    </div>
  );
}
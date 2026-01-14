import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { BlogsPage } from './components/BlogsPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { BlogManager } from './components/BlogManager';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "blogs",
        element: <BlogsPage />
      },
      {
        path: "blogs/:category",
        element: <BlogPage />
      },
      {
        path: "blogs/:category/:postId",
        element: <BlogPostPage />
      },
      {
        path: "blog-manager",
        element: <BlogManager onBack={() => window.history.back()} />
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

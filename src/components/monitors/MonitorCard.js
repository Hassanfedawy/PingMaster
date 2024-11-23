'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MonitorCard({ monitor, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    name: monitor.name,
    url: monitor.url,
    interval: monitor.interval,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(monitor._id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating monitor:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(monitor._id);
    } catch (error) {
      console.error('Error deleting monitor:', error);
      setIsDeleting(false);
    }
  };

  const statusColor = {
    up: 'bg-green-100 text-green-800',
    down: 'bg-red-100 text-red-800',
    null: 'bg-gray-100 text-gray-800'
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check Interval (minutes)
            </label>
            <input
              type="number"
              value={editData.interval}
              onChange={(e) => setEditData({ ...editData, interval: Number(e.target.value) })}
              min="1"
              max="60"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-medium text-gray-900 truncate">{monitor.name}</h2>
          <p className="text-sm text-gray-500 truncate">{monitor.url}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[monitor.lastStatus || 'null']}`}>
            {monitor.lastStatus ? monitor.lastStatus.toUpperCase() : 'PENDING'}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-500">
        <div>
          <span className="block font-medium text-gray-900">Uptime</span>
          {monitor.uptime}%
        </div>
        <div>
          <span className="block font-medium text-gray-900">Response Time</span>
          {monitor.responseTime}ms
        </div>
        <div>
          <span className="block font-medium text-gray-900">Check Interval</span>
          {monitor.interval}m
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </motion.div>
  );
}

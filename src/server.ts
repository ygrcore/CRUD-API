import http from 'http';
import url from 'url';
import { User } from './types/types';
import { getAllUsers, getUserById, createNewUser, updateUser, deleteUser } from './user/userMethods';

let users: User[] = [];

export const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url || '', true);

  if (req.method === 'GET' && pathname === '/api/users') {
    getAllUsers(res, users);
  } else if (req.method === 'GET' && pathname?.startsWith('/api/users/')) {
    getUserById(res, users, pathname);
  } else if (req.method === 'POST' && pathname === '/api/users') {
    createNewUser(res, req, users);
  } else if (req.method === 'PUT' && pathname?.startsWith('/api/users/')) {
    updateUser(res, req, users, pathname);
  } else if (req.method === 'DELETE' && pathname?.startsWith('/api/users/')) {
    deleteUser(res, users, pathname);
  } else {
    // Handle errors
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid data in request' }));
  }
});

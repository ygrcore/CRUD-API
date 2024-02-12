import http from 'http';
import url from 'url';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from './types/types';

let users: User[] = [];

export const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url || '', true);

  if (req.method === 'GET' && pathname === '/api/users') {
    // Get all users
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'GET' && pathname?.startsWith('/api/users/')) {
    // Get user by ID

    const userId = pathname.split('/').pop()!;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid userId' }));
      return;
    }

    const user = users.find((user) => user.id === userId);

    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else if (req.method === 'POST' && pathname === '/api/users') {
    // Create a new user
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let parsedData: User;

      try {
        parsedData = JSON.parse(body);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid data in request' }));
        return;
      }
      const { name, age, hobbies } = parsedData;

      if (!name || !age || !hobbies) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      const newUser: User = {
        id: uuidv4(),
        name,
        age,
        hobbies,
      };

      users.push(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else if (req.method === 'PUT' && pathname?.startsWith('/api/users/')) {

    const userId = pathname.split('/').pop()!;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid userId' }));
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      const updatedUser = { ...users[userIndex], ...JSON.parse(body) };
      users[userIndex] = updatedUser;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    });
  } else if (req.method === 'DELETE' && pathname?.startsWith('/api/users/')) {
    // Delete user by ID
    const userId = pathname.split('/').pop()!;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid userId' }));
      return;
    }

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    users.splice(userIndex, 1);

    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end();
  } else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid data in request' }));
  }
});

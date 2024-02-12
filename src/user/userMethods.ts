import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from '../types/types';

export const getAllUsers = (res: ServerResponse, users: User[]) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUserById = (res: ServerResponse, users: User[], pathname: string) => {
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
}

export const createNewUser = (res: ServerResponse, req: IncomingMessage, users: User[]) => {
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
};

export const updateUser = (res: ServerResponse, req: IncomingMessage, users: User[], pathname: string) => {
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
}

export const deleteUser = (res: ServerResponse, users: User[], pathname: string) => {
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
}
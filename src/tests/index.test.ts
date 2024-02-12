import { getAllUsers, getUserById } from '../user/userMethods';
import { v4 as uuidv4 } from 'uuid';

describe('getAllUsers', () => {
  test('should respond with status code 200 and users list', () => {
    const res: any = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const users = [{ id: uuidv4(), name: 'John', age: 30, hobbies: ['Coding', 'Video Games'] }];
    getAllUsers(res, users);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(users));
  });
});

describe('getUserById', () => {
  test('should respond with status code 200 and user data', () => {
    const res: any = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const id = uuidv4();
    const users = [{ id: `${id}`, name: 'John', age: 30, hobbies: ['Coding', 'Video Games'] }];
    getUserById(res, users, `/api/users/${id}`);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(users[0]));
  });

  test('should respond with status code 400 for invalid userId', () => {
    const res: any = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    getUserById(res, [], '/api/users/invalidId');

    expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Invalid userId' }));
  });

});

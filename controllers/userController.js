import { find, create } from '../models/userModel';

export async function getUsers(req, res) {
  const users = await find();
  res.json(users);
}

export async function createUser(req, res) {
  const { name, email, password } = req.body;
  const newUser = await create({ name, email, password });
  res.status(201).json(newUser);
}

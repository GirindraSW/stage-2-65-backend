import { Request,Response } from 'express';
import prisma from '../connection/client';

// Helper parseId for String (cuid  Collision-resistant Unique Identifier)
const parseIdParam = (idParam: string | string[] | undefined): string | undefined => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return value;
};

// CREATE USER
export const createUser = async (req:Request, res:Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "something is wrong" });
  }
};

// GET ALL USER
export const getAllUsers = async (req:Request, res:Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({  error: "something is wrong" });
  }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const userId = parseIdParam(id);
    if (!userId) {
      return res.status(400).json({ error: "id is required" });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = parseIdParam(id);
    if (!userId) {
      return res.status(400).json({ error: "id is required" });
    }
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

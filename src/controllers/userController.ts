import { Request,Response } from 'express';
import prisma from '../../prisma/client';

// Helper parseId for String (cuid  Collision-resistant Unique Identifier)
const parseIdParam = (idParam: string | string[] | undefined): string | undefined => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return value;
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

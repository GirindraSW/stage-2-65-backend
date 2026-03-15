import { Request,Response } from "express";
import prisma from "../connection/client";

// Helper parseId for String (cuid  Collision-resistant Unique Identifier)
const parseIdParam = (idParam: string | string[] | undefined): string | undefined => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return value;
};


// CREATE Post
export const createPost = async (req:Request, res:Response) => {
  const { title, content, userId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, userId },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat postingan" });
  }
};

// GET ALL Post
export const getAllPosts = async (req:Request, res:Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Gagal memuat postingan" });
  }
};

// UPDDATE Post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const postId = parseIdParam(id);
    if (!postId) {
      return res.status(400).json({ error: "id is required" });
    }
    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Post
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const postId = parseIdParam(id);
    if (!postId) {
      return res.status(400).json({ error: "id is required" });
    }
    await prisma.post.delete({
      where: { id: postId },
    });
    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

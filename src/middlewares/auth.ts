import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const bearerToken = authHeader?.replace("Bearer ", "").trim();
  const cookieToken = (req as any).cookies?.supplier_token;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Token tidak valid." });
  }

  req.user = decoded;
  next();
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "Akses ditolak. Peran tidak diizinkan." });
    }
    next();
  };
};


// export function authenticate (req:Request, res: Response, next: NextFunction){
// console.log.(req.headers.authorization);

//     const token = req.header.authorization?.split(" ")[1];
//     if(!token){
//         res.status(401).json({message: "Unauthorized"});
//         return;
//     }
    
//     try{
//         const decoded = verifyToken(token);
//         (req as any).user = decoded as any;
//         next();
//     }   catch {
//         res.status(401).json({ message: "invalid token"});
//         return;
//     }
// }

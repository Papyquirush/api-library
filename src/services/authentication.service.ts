import { User } from "../models/user.model"; // Modèle Sequelize
import jwt from "jsonwebtoken"; // Pour générer le JWT
import { Buffer } from "buffer"; // Pour décoder Base64
import { notFound } from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Clé secrète pour signer le token

export class AuthenticationService {
  public async authenticate(
    username: string,
    password: string
  ): Promise<string> {
    // Recherche l'utilisateur dans la base de données
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw notFound("User");
    }

    // Décoder le mot de passe stocké en base de données
    const decodedPassword = Buffer.from(user.password, "base64").toString(
      "utf-8"
    );

    // Vérifie si le mot de passe est correct
    if (password === decodedPassword) {
      // Si l'utilisateur est authentifié, on génère un JWT
      const token = jwt.sign(
        {
          username: user.username,
          scopes: AuthenticationService.getPermissions(user.username),
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );





      return token;
    } else {
      let error = new Error("Wrong password");
      (error as any).status = 403;
      throw error;
    }
  }

  private static getPermissions(username: string): { [key: string]: string[] } {
    switch (username) {
      case 'admin':
        return {
          book: ['read', 'write', 'delete'],
          author: ['read', 'write', 'delete'],
          bookCollection: ['read', 'write', 'delete'],
        };
      case 'gerant':
        return {
          book: ['read', 'write'],
          author: ['read', 'write'],
          bookCollection: ['read', 'write', 'delete'],
        };
      case 'utilisateur':
        return {
          book: ['read', 'write'],
          author: ['read'],
          bookCollection: ['read'],
        };
      default:
        return {
          book: [],
          author: [],
          bookCollection: [],
        };
    }
  }

}

export const authService = new AuthenticationService();
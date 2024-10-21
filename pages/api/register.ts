import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from './auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await registerUser(email, password);
      res.status(200).json({ user });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
        res.status(400).json({ error: "Este e-mail já está em uso. Por favor, tente outro." });
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

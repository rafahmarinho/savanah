import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from './auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await loginUser(email, password);
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Erro desconhecido." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

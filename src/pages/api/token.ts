import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.cookies['reddit-access-token'];
  const refreshToken = req.cookies['reddit-refresh-token'];

  if (!accessToken) {
    return res.status(418).send('');
  }

  res.status(200).json({ accessToken, refreshToken });
};

export default handler;

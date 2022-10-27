import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res, { secure: true });

  cookies.set('reddit-access-token');
  cookies.set('reddit-refresh-token');

  res.status(200).send('');
};

export default handler;

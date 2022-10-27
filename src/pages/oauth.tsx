import type { GetServerSideProps, NextPage } from 'next';
import { getReddit } from 'reddit';
import { Reddit } from 'reddit.types';
import Cookies from 'cookies';

const OauthRedirect: NextPage = () => <></>;

export default OauthRedirect;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cookies = new Cookies(req, res, { secure: true });

  const code = query.code as string;
  const state = query.state as string;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URL);

  try {
    const res = await getReddit().post<Reddit.AccessTokenResponse>(
      'https://www.reddit.com/api/v1/access_token',
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET,
        },
      }
    );

    cookies.set('reddit-access-token', res.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: res.data.expires_in,
    });

    cookies.set('reddit-refresh-token', res.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};

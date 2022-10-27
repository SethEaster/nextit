import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import axios from 'axios';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useGlobal } from 'stores/global';
import 'styles/globals.scss';

config.autoAddCss = false;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const redditAccessToken = useGlobal(state => state.redditAccessToken);

  const accessTokenExists = redditAccessToken !== '';

  useEffect(() => {
    if (!accessTokenExists) {
      const getToken = async () => {
        const res = await axios.get('/api/token').catch(err => null);
        if (res) {
          useGlobal.getState().setRedditAccessToken(res?.data.accessToken);
          queryClient.invalidateQueries(['me']);
        }
      };

      getToken();
    }
  }, [redditAccessToken]);

  return (
    <QueryClientProvider client={queryClient} key="queryClientProvider">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <title>Nextit</title>
      </Head>
      {/* <AnimatePresence
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
        exitBeforeEnter
      > */}
      {/* <SkeletonTheme
          baseColor="#d7d7d7"
          highlightColor="#f3f3f3"
          duration={1}
          key="skeletonTheme"
        > */}
      <Component {...pageProps} key={router.route} />
      {/* </SkeletonTheme> */}
      {/* </AnimatePresence> */}
    </QueryClientProvider>
  );
}

export default App;

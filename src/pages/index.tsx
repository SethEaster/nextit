import type { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    permanent: false,
    destination: '/r/all',
  },
});

const Index: NextPage = () => {
  return <></>;
};

export default Index;

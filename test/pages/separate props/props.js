export const getStaticProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];

  return {
    props: {
      products,
    },
  };
};

export const getServerSideProps = getStaticProps;

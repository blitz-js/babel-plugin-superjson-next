import type { GetStaticProps, InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  return {
    props: {
      date: new Date(0),
    },
  };
}

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return 'props.date is Date: ' + (props.date instanceof Date);
};

Page.getLayout = (page) => <>This is part of the static method {page}</>;

export default Page;

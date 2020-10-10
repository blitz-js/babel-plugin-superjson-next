import { InferGetStaticPropsType, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async () => {
  return {
    props: {
      date: new Date(),
    },
  };
};

export default function WithFallback(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return 'props.date is Date: ' + (props.date instanceof Date);
}

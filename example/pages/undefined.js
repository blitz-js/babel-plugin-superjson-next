export async function getStaticProps() {
  return {
    props: undefined,
  };
}

export default function Page(props) {
  return 'props: ' + JSON.stringify(props);
}

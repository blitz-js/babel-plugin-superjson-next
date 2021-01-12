export const getStaticProps = () => ({
  props: { today: new Date() },
});

export default function IndexPage({ today }) {
  return 'props.today is Date: ' + (today instanceof Date);
}

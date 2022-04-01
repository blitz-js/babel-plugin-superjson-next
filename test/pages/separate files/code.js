export default function Page({ products }) {
  return JSON.stringify(products);
}

export { getStaticProps } from './props';

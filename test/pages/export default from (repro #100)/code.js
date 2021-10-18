import { ssrUserPage } from "lib/ssr_user_page";

export const getServerSideProps = ssrUserPage;

export { default } from "./user";
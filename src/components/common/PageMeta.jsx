import { HelmetProvider, Helmet } from "react-helmet-async";

// Este componente simplemente cambia las etiquetas del head de la pagina
const PageMeta = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;

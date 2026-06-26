import { Redirect } from 'expo-router';

/**
 * Entrada raíz de enrutamiento. Redirige inmediatamente al flujo de login,
 * el cual está custodiado por las guardas de autenticación en el Layout principal.
 */
export default function IndexRedirect() {
  return <Redirect href="/(auth)/login" />;
}

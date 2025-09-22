import { Redirect } from 'expo-router';

//Provisório: redireciona pra tela do diário rsrs
export default function Home() {
  return <Redirect href="/diary/diary" />;
}
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

export default function QuizDaGaleraPage({ dbExterno, name }) {
  // const [db, setDb] React.useState({})
  // React.useEffect(() => {
  // });
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen
        externalQuestions={dbExterno.questions}
        externalBg={dbExterno.bg}
        name={name}
      />
    </ThemeProvider>
    // {/* <pre style={{ color: 'black' }}>
    //   {JSON.stringify(dbExterno.questions, null, 4)}
    // </pre> */}
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');
  const { name } = context.query;

  try {
    console.log(`https://${projectName}.${githubUser}.vercel.app/api/db`);
    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)

      .then((respostaDoServer) => {
        if (respostaDoServer.ok) {
          return respostaDoServer.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto);
      // .catch((err) => {
      //   // console.error(err);
      // });

    // console.log('dbExterno', dbExterno);
    // console.log('Infos que o Next da para nós', context.query.id);
    return {
      props: {
        dbExterno,
        name,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
}

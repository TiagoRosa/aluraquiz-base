/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// import db from '../../../db.json';
import { Lottie } from '@crello/react-lottie';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativeForm from '../../components/AlternativeForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import loadingAnimation from '../../components/Widget/animation.json';

function ResultWidget({ results, name }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultados
      </Widget.Header>

      <Widget.Content>
        <p>
          Olá
          {' '}
          {name}
          {' '}
          você acertou
          {' '}
          {/* {results.reduce((somatorioAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return somatorioAtual + 1;
            }
            return somatorioAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          perguntas

        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${index + 1}`}>
              #
              {index + 1}
              {' '}
              Resposta:
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}

        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <Lottie
          width="200px"
          height="200px"
          className="lottie-container basic"
          config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState();
  const [correctAlternative, setCorrectAlternative] = useState(undefined);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativeForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setCorrectAlternative(true);
            setTimeout(() => {
              addResult(isCorrect);
              setCorrectAlternative(undefined);
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
              onSubmit();
            }, 3 * 500);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && isSelected && alternativeStatus}
                data-right={isQuestionSubmited && alternativeIndex === question.answer && correctAlternative}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Certa Resposta</p>}
          {isQuestionSubmited && !isCorrect && <p>Infelizmente você errou</p>}
        </AlternativeForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage({ externalQuestions, externalBg, name }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const totalQuestions = externalQuestions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const [results, setResults] = useState([]);
  const bg = externalBg;

  function addResult(result) {
    setResults([...results, result]);
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget name={name} results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}

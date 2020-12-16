import prompts from "prompts";
import Gourmet, { Question } from "./gourmet";

const gourmet = new Gourmet();

// inicia jogo e retorna a primeira pergunta
let question: Question = gourmet.init();

/**
 * é executado toda vez que uma pergunta é respondida
 * @param reset se true então reinicia o jogo
 */
async function Main(reset: boolean): Promise<boolean> {
  // inicia o jogo novamente fazendo a primeira pergunta
  if (reset) {
    await prompts({
      type: "confirm",
      name: "confirm",
      message: `Pense em um prato que gosta!`,
      initial: true,
    });
    question = gourmet.getFirstQuestion();
  }

  // responde se é uma comida semelhante
  if (question.type === "isSimilar") {
    const { right } = await prompts({
      type: "confirm",
      name: "right",
      message: `O prato que você pensou é ${question.food.type}?`,
      initial: true,
    });

    question = gourmet.answerIsSimilarFood(question.food, right);
    return Main(false);
  }

  // se não possui comidas semelhantes então pergunta se é a comida
  const { right } = await prompts({
    type: "confirm",
    name: "right",
    message: `O prato que você pensou é ${question.food.name}?`,
    initial: true,
  });

  // se comida encontrada
  if (right) {
      console.info("Acertei de novo!"); //eslint-disable-line
  } else {
    const { name } = await prompts({
      type: "text",
      name: "name",
      message: `Qual prato você pensou?`,
    });

    const { type } = await prompts({
      type: "text",
      name: "type",
      message: `${name} é _____ mas ${question.food.name} não.`,
    });

    // insere nova comida semelhante
    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name,
      type,
      similar: [],
    });

    return Main(true);
  }

  return Main(true);
}

Main(true);

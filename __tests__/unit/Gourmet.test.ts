import Gourmet from "../../src/gourmet";

describe("Gourmet", () => {
  it("ao realizar a primeira pergunta deve exibir se é uma comida com massa", () => {
    const gourmet = new Gourmet();
    const question = gourmet.init();

    expect(question.type).toBe("isSimilar");
    expect(`O prato que você pensou é ${question.food.type}?`).toBe(
      "O prato que você pensou é massa?"
    );
  });

  it("ao responder que é uma comida com massa então deve questionar se é Lasanha", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, true);

    expect(question.type).toBe("isFood");
    expect(`O prato que você pensou é ${question.food.name}?`).toBe(
      "O prato que você pensou é Lasanha?"
    );
  });

  it("Se não é uma comida com massa então deve questionar se é um bolo", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false);

    expect(question.type).toBe("isFood");
    expect(`O prato que você pensou é ${question.food.name}?`).toBe(
      "O prato que você pensou é Bolo de chocolate?"
    );
  });

  it("Se não é uma comida com massa e não é um bolo então deve questionar qual é a comida", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é uma comida com massa
    question = gourmet.answerIsFood(question.food, false); // não é bolo

    expect(question.type).toBe("newFood");
  });

  it("Se não é uma massa mas é um bolo então deve exibir que a comida foi encontrada", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false);
    question = gourmet.answerIsFood(question.food, true);

    expect(question.type).toBe("foodFound");
  });

  it("Inserir nova comida semelhante", () => {
    const gourmet = new Gourmet();
    const question = gourmet.init();
    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name: "Pizza",
      type: "redonda",
      similar: [],
    });

    const [massa] = gourmet.getFoods();
    expect(massa.similar[0].name).toStrictEqual("Pizza");
  });

  it("Se é massa e é redonda então é pizza", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, true); // é massa
    question = gourmet.answerIsFood(question.food, false); // não é lasanha

    // se não é lasanha então pergunta qual é a nova comida
    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name: "Pizza",
      type: "redonda",
      similar: [],
    });

    question = gourmet.getFirstQuestion();
    question = gourmet.answerIsSimilarFood(question.food, true); // é massa
    question = gourmet.answerIsSimilarFood(question.food, true); // é redonda
    question = gourmet.answerIsFood(question.food, true); // é pizza
    expect(question.type).toBe("foodFound");
    expect(question.food.name).toBe("Pizza");
  });

  it("Não é massa mas é comprido", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é massa
    question = gourmet.answerIsSimilarFood(question.food, false); // não é bolo

    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name: "Batata frita",
      type: "comprido",
      similar: [],
    });

    question = gourmet.getFirstQuestion();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é massa
    question = gourmet.answerIsSimilarFood(question.food, true); // é comprido
    question = gourmet.answerIsFood(question.food, true); // é batata

    expect(question.type).toBe("foodFound");
    expect(question.food.name).toBe("Batata frita");
  });

  it("Não é massa é carne mas é caro", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é massa
    question = gourmet.answerIsSimilarFood(question.food, false); // não é bolo

    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name: "Bife",
      type: "carne",
      similar: [
        {
          name: "Picanha",
          type: "caro",
          similar: [],
        },
      ],
    });

    question = gourmet.getFirstQuestion();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é massa
    question = gourmet.answerIsSimilarFood(question.food, true); // é carne
    question = gourmet.answerIsSimilarFood(question.food, true); // é caro
    question = gourmet.answerIsFood(question.food, true); // é picanha

    expect(question.type).toBe("foodFound");
    expect(question.food.name).toBe("Picanha");
  });

  it("Não inserir nova comida se nome ou tipo estiver vazio", () => {
    const gourmet = new Gourmet();
    let question = gourmet.init();
    question = gourmet.answerIsSimilarFood(question.food, false); // não é massa
    question = gourmet.answerIsSimilarFood(question.food, false); // não é bolo

    Gourmet.pushSimilarFood(question.food, {
      parent: question.food,
      name: "",
      type: "",
      similar: [],
    });

    expect(question.food.similar.length).toBe(0);
  });
});

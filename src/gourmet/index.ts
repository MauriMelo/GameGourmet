export interface Food {
  parent?: Food;
  name: string;
  type: string;
  similar: Food[];
}

export interface Question {
  type?: "isFood" | "isSimilar" | "newFood" | "foodFound";
  food: Food;
}

/** retorna as comidas pré-cadastradas */
const getInitialFoods = (): Food[] => [
  {
    name: "Lasanha",
    type: "massa",
    similar: [],
  },
  {
    name: "Bolo de chocolate",
    type: "doce",
    similar: [],
  },
];

export default class Gourmet {
  private foods: Food[] = getInitialFoods();

  private indexSimilar: number = 0;

  private indexFood: number = 0;

  /**
   * Reseta jogo removendo as perguntas cadastradas e retorna a primeira pergunta
   */
  public init() {
    this.foods = getInitialFoods();
    return this.getFirstQuestion();
  }

  /**
   * Retorna a primeira pergunta
   */
  public getFirstQuestion() {
    this.indexFood = 0;
    this.indexSimilar = 0;
    return Gourmet.isSimilar(this.foods[0]);
  }

  /**
   * Trata a nova pergunta com base se é ou não uma comida semelhante
   * @param food Food
   * @param yes boolean
   */
  public answerIsSimilarFood(food: Food, yes: boolean): Question {
    // se é uma comida semelhante
    if (yes) {
      // se possui comidas outras comidas semelhantes
      if (food.similar[this.indexSimilar]) {
        return Gourmet.isSimilar(food.similar[this.indexSimilar]);
      }

      // se não pergunta se é o comida
      return Gourmet.isFood(food);
    }

    // se não é semelhante porém tem outras comidas semelhantes
    if (food.similar[this.indexSimilar]) {
      const question = Gourmet.isSimilar(food.similar[this.indexSimilar]);
      this.indexSimilar += 1;
      return question;
    }

    this.indexSimilar = 0;
    // se não possui mais comidas semelhantes então tenta encontrar nas comidas antecessores
    if (food.parent) {
      // verifica se na antecessor possui comidas semelhantes
      const nextSimilar = food.parent.similar.indexOf(food) + 1;
      if (food.parent.similar[nextSimilar]) {
        return Gourmet.isSimilar(food.parent.similar[nextSimilar]);
      }

      // se não possui semelhantes então pergunta se é a comida
      return Gourmet.isFood(food.parent);
    }

    // se não possui semelhantes então busca no proximo item do array (Bolo de chocolate)
    if (this.foods[this.indexFood + 1]) {
      this.indexFood += 1;
      if (this.foods[this.indexFood].similar[this.indexSimilar]) {
        return Gourmet.isSimilar(
          this.foods[this.indexFood].similar[this.indexSimilar]
        );
      }
      return Gourmet.isFood(this.foods[this.indexFood]);
    }
    return Gourmet.isSimilar(this.foods[this.indexFood]);
  }

  /**
   * Resposta se é ou não a comida
   * @param food
   * @param yes
   */
  public answerIsFood(food: Food, yes: boolean): Question {
    // se sim então retorna sucesso
    if (yes) {
      this.indexSimilar = 0;
      return Gourmet.foodFound(food);
    }

    // se não então pergunta qual é a comida
    return Gourmet.whatIsFood(food);
  }

  getFoods(): Food[] {
    return this.foods;
  }

  /**
   * Adiciona nova comida semelhante
   * @param food Food
   * @param newFood Food
   */
  static pushSimilarFood(food: Food, newFood: Food) {
    if (!newFood.name || !newFood.type) {
      console.log("Cadastro de comida inválido!"); //eslint-disable-line
      return;
    }
    food.similar.push(newFood);
  }

  static foodFound(food: Food): Question {
    return {
      type: "foodFound",
      food,
    };
  }

  static isSimilar(food: Food): Question {
    return {
      type: "isSimilar",
      food,
    };
  }

  static isFood(food: Food): Question {
    return {
      type: "isFood",
      food,
    };
  }

  static whatIsFood(food: Food): Question {
    return {
      type: "newFood",
      food,
    };
  }
}

class Nutrition {
  nutritionTarget(height, weight, age, gender, activity_level, workout) {
    height = parseInt(height);
    weight = parseInt(weight);
    age = parseInt(age);
    let calorie_needs = 0;
    let protein_needs = 0;
    let carbohydrate_needs = 0;
    let fat_needs = 0;
    let bmr = 0;
    if (gender.toLowerCase() == "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    if (activity_level == "sedentary") {
      calorie_needs = bmr * 1.2;
    } else if (activity_level == "lightly_active") {
      calorie_needs = bmr * 1.375;
    } else if (activity_level == "moderately_active") {
      calorie_needs = bmr * 1.55;
    } else if (activity_level == "very_active") {
      calorie_needs = bmr * 1.725;
    } else {
      calorie_needs = bmr * 1.9;
    }

    if (workout == "yes") {
      protein_needs = (calorie_needs * 0.3) / 4;
      carbohydrate_needs = (calorie_needs * 0.4) / 4;
      fat_needs = (calorie_needs * 0.3) / 9;
    } else {
      protein_needs = weight * 1.2;
      carbohydrate_needs = (calorie_needs * 0.55) / 4;
      fat_needs = (calorie_needs * 0.3) / 9;
    }
    calorie_needs = Math.floor(calorie_needs);
    protein_needs = Math.floor(protein_needs);
    carbohydrate_needs = Math.floor(carbohydrate_needs);
    fat_needs = Math.floor(fat_needs);
    return {
      熱量: calorie_needs,
      蛋白質: protein_needs,
      脂肪: fat_needs,
      碳水化合物: carbohydrate_needs,
    };
  }
}
module.exports = new Nutrition();

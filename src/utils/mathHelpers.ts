// Logistic function
export default function logistic (intercept: number, beta: number, x: number): number{
  return 1 / (1 + Math.exp(-(intercept + beta * x)));
};

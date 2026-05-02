export const PROTECTED_ROUTES = ['/shopping-list'] as const;

export const APP_ROUTES = {
  home: '',
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact',
  login: 'login',
  shoppingList: 'shopping-list',
  games: 'games',
  chess: 'games/chess',
  visualization: 'games/chess/visualization',
  colorTraining: 'games/chess/visualization/color'
} as const;

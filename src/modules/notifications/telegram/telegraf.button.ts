import { Markup } from 'telegraf';
export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('La Paz', 'lpz'),
      Markup.button.callback('El Alto', 'elt'),
      Markup.button.callback('Cochabamba', 'cbba'),
      Markup.button.callback('Santa Cruz', 'scz'),
      Markup.button.callback('Sucre', 'scr'),
      Markup.button.callback('Oruro', 'oro'),
      //Markup.button.callback('Potosi', 'pts'),
      //Markup.button.callback('Tarija', 'tja'),
      //Markup.button.callback('Nuevitas 18+ La Paz', 'nuelpz'),
      //Markup.button.callback('Nuevitas 18+ El Alto', 'nueelt'),
      //
    ],
    {
      columns: 3,
    },
  );
}

export function actionButtonsList() {
  return Markup.keyboard(
    [
      Markup.button.callback('La Paz', 'lpz'),
      Markup.button.callback('El Alto', 'elt'),
      Markup.button.callback('Cochabamba', 'cbba'),
      Markup.button.callback('Santa Cruz', 'scz'),
      Markup.button.callback('Sucre', 'scr'),
      Markup.button.callback('Oruro', 'oro'),
      //Markup.button.callback('Potosi', 'pts'),
      //Markup.button.callback('Tarija', 'tja'),
      //Markup.button.callback('Nuevitas 18+ La Paz', 'nuelpz'),
      //Markup.button.callback('Nuevitas 18+ El Alto', 'nueelt'),
      //
    ],
    {
      columns: 3,
    },
  );
}

export const showList = (todos) => {
  `Aqui la lista: \n\n${todos
    .map((todo) => (todo.isComplete ? 'yes' : 'no') + ' ' + todo.name + '\n\n')
    .join('')}`;
};


export let todos: ITodo[] = [
  { id: 1, name: "Eat breakfast", isDone: false },
  { id: 2, name: "Buy bread", isDone: true },
  { id: 3, name: "Go to street", isDone: false },
  { id: 4, name: "Go to street", isDone: false },
  { id: 5, name: "Go to street", isDone: false },
]


export const completeTodo = (id: string) => {
  const needToDO = todos.find(todo => todo.id === +id)
  if (!needToDO) {
    return 'not found'
  }
  if (needToDO.isDone === true) {
    return 'already'
  }
  needToDO.isDone = true
  return 'complete'
}

export const remoteToDo = (id: string) => {
  const needToDO = todos.find(todo => todo.id === +id)
  if (!needToDO) {
    return 'not found'
  }
  todos = todos.filter((a) => a.id !== +id);
  return 'complete'
}

export const addToDo = (name: string) => {
  if (!name.trim()) {
    return 'empty'
  }
  if (name.trim().length < 3) {
    return 'small'
  }
  const lastIndex = todos[todos.length - 1]
  todos.push({ id: lastIndex.id + 1, name, isDone: false})
  return 'complete'
}


interface ITodo {
  id: number,
  name: string,
  isDone: boolean
}
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import moment from 'moment';

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();
const getCurrentDateTime = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: true, duedate: getCurrentDateTime(), env: 'domain' });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

        
    <Authenticator>
      {({ signOut, user }) => (

    <main>
          <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        <br />
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>

        
)}
</Authenticator>
  );
}

export default App;

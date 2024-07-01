import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import moment from 'moment';

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import { TodoCreateForm } from '../ui-components';
import { Tabs } from '@aws-amplify/ui-react';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@aws-amplify/ui-react';
import { Button } from '@aws-amplify/ui-react';

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
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: true, duedate: getCurrentDateTime(), env: 'domain'});
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

        
    <Authenticator>
      {({ signOut, user }) => (


    <main>
       <button onClick={signOut}>Sign out</button>
          {/* <h1>{user?.signInDetails?.loginId}'s todos</h1> 
      <TodoCreateForm />
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
      <button onClick={signOut}>Sign out</button>*/}
    
    <Tabs
      spacing="equal"
      justifyContent="center"
      defaultValue='Tab 1'
      items={[
        { label: 'Create a TODO', value: 'Tab 1', content: (
            <>
              <TodoCreateForm />
            </>
            ) },
        { label: 'List TODOs', value: 'Tab 2', content: (
          <>
          <Table title="Table">
          <TableHead>
            <TableRow>
              <TableCell as="th">Content</TableCell>
              <TableCell as="th">IsDone</TableCell>
              <TableCell as="th">DueDate</TableCell>
              <TableCell as="th">Env</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {todos.map((todo) => (
            <TableRow>
              <TableCell key={todo.id}>{todo.content}</TableCell>
              <TableCell key={todo.id} ><p>{todo.isDone ? 'True' : 'False'}</p></TableCell>
              <TableCell key={todo.id}>{todo.duedate}</TableCell>
              <TableCell key={todo.id}>{todo.env}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>      
        </>
        )},
      ]}
    />
         
    </main>

        
)}
</Authenticator>
  );
}

export default App;

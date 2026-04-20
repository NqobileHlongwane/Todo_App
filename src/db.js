import { supabase } from "../config/supabase.js";

class db {

static async createUser(users){
    console.log('Creating a user..')

    const { data, error } = await supabase
  .from('users')
  .insert([users])
  .select()
   .single(); 

    if (error) {
            throw new Error(error.message);
        }

        //return created user
        return data;
}

//TODO

//create a todo
static async createTodo({ user_id, task ,completed = false}) {
  const { data, error } = await supabase
    .from('todo')
    .insert({
      user_id,
      task,completed}
    )
    .select()
    .single();
          
   if (error) {
            throw new Error(error.message);
        }

        //return created todo
        return data;
          
}

static async viewUser(
        
        username){
        let { data: users, error } = await supabase
  .from('users')
  .select(
        '*'
  )
  .eq('username',username)
  
.single(); //fetching only a single user at a time

    if (error) {
        return null;}

        //return a user
        return users;

}
//view all to dos
static async viewTodo(user_id){

let { data: todo, error } = await supabase
  .from('todo')
  .select('*')
  .eq('user_id', user_id)
          if (error) {
            throw new Error(error.message);
        }

        //return a todo
        return todo;
}

//update a todo by user id
static async updateTodoById(id, user_id, completed){
  const { data, error } = await supabase
    .from('todo')
    .update({ completed})
    .eq('id', id)
    .eq('user_id', user_id)
    .select()
    .maybeSingle();
    


          if (error) {
            throw new Error(error.message);
        }

        //return updated todo
        return data[0];
}
static async deleteTodo(id,user_id){

const { data ,error } = await supabase
  .from('todo')
  .delete()
  .eq('id', id)
.eq('user_id', user_id)
.select()
    .maybeSingle();
          if (error) {
            throw new Error(error.message);
        }

        //return updated todo
        return data[0]; 
}
}

export default db
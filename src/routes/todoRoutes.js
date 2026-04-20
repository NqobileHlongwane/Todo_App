import express from 'express'
import db from '../db.js'

const router = express.Router()

//GET all to-dos for all logged in  users
//display the todos on the dashboard
router.get('/',async (req, res) =>{
    
 try{ 
  //we will require a query to access user id
  const user_id = req.user_id

 //get all user todos
  const todo = await db.viewTodo(user_id)
  console.log("USER ID FROM TOKEN:", req.user_id);

  
  if (!req.user_id) {
  return res.status(400).json({ error: "Missing user_id" });
}
res.status(201).json(todo)

}
catch(error){res.status(500).json({error: error.message})
}

})

//CREATE todos for logged in users
router.post('/', async (req, res) =>{
//always inlcude req.body for post methods
const { task} = req.body
const user_id = req.user_id 

if (!task){
  return res.status(400).json({message: "task required"})
}

const addTask = await db.createTodo ( {user_id, task, completed: false})

console.log("this is a task", addTask)

res.status(201).json(addTask)


})

//UPDATE / MODIFY user todo
router.put('/:id', async (req, res) =>{
  const { completed } = req.body 
  const user_id = req.user_id
  
  

  const updateTodo = await db.updateTodoById(req.params.id,user_id, completed )

  console.log(updateTodo)

  res.status(200).json({message: "completed"})
})

//DELETE a todo

router.delete('/:id', async (req, res) =>{

  const user_id = req.user_id

  const result = await db.deleteTodo(req.params.id, user_id)
 console.log("successfully deleted a task")

 res.status(200).json({message: "To do deleted"})
})

export default router
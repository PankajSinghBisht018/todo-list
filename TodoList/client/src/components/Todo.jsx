import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSave, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import DotPattern from "@/components/magicui/dot-pattern";
import ShinyButton from "@/components/magicui/shiny-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import { fetchTodos, addTodo, deleteTodo, updateTodo, completeTodo } from "@/features/todoSlice";

const Todo = ({ showCompleted }) => {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.todos);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [addingTask, setAddingTask] = useState(false);
    const [editTodoId, setEditTodoId] = useState(null);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    const handleAdd = async () => {
        if (title.trim() !== "" && body.trim() !== "") {
            setAddingTask(true);
            try {
                await dispatch(addTodo({ title, body, completed: false }));
                setTitle("");
                setBody("");
                toast.success("Task added successfully!", { position: "top-center" });
            } catch (error) {
                toast.error("Error adding task. Please try again.", { position: "top-center" });
            } finally {
                setAddingTask(false);
            }
        } else {
            toast.error("Please enter a title and body for the task!", { position: "top-center" });
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteTodo(id));
            toast.error("Task deleted successfully!", { position: "top-center" });
        } catch (error) {
            toast.error("Error deleting task. Please try again.", { position: "top-center" });
        }
    };

    const handleEdit = (id, title, body) => {
        setEditTodoId(id);
        setTitle(title);
        setBody(body);
    };

    const handleUpdate = async (id) => {
        if (title.trim() !== "" && body.trim() !== "") {
            try {
                const todo = todos.find((item) => item._id === id);
                await dispatch(updateTodo({ _id: id, title, body, completed: todo.completed }));
                setEditTodoId(null);
                setTitle("");
                setBody("");
                toast.success("Task updated successfully!", { position: "top-center" });
            } catch (error) {
                toast.error("Error updating task. Please try again.", { position: "top-center" });
            }
        } else {
            toast.error("Please enter a valid title and body for the task!", { position: "top-center" });
        }
    };

    const handleComplete = async (id) => {
        try {
            await dispatch(completeTodo(id));
        } catch (error) {
            toast.error("Error updating task. Please try again.", { position: "top-center" });
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className="absolute inset-0 z-0"
                style={{ backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative pt-4 z-10 max-w-4xl mx-auto mb-4">
                <ToastContainer position="top-center" />
                <Card className="mb-4 bg-gray-800 text-white relative">
                    <CardHeader>
                        <CardTitle>Add Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mb-2 text-black"
                            />
                            <Label htmlFor="body">Body</Label>
                            <Input
                                id="body"
                                placeholder="Body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="text-black"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <ShinyButton
                            text={addingTask ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faPlus} /> Add</>}
                            onClick={handleAdd}
                            disabled={addingTask}
                            className="text-black bg-white rounded-xl py-2 px-3"
                        />
                    </CardFooter>
                    <BorderBeam size={300} duration={12} delay={9} />
                </Card>
                <Typography variant="h5" className="font-bold mb-2">Tasks</Typography>
                <div className="flex flex-wrap gap-4">
                    {todos.map((todo) => (
                        (showCompleted && todo.completed) || (!showCompleted && !todo.completed) ? (
                            <div key={todo._id} className="w-full bg-gray-800 text-white relative p-4 rounded-lg">
                                <CardContent>
                                    <div className="flex flex-col mb-2">
                                        <div className="flex justify-between items-center">
                                            <Typography variant="h6" className={`font-bold ${todo.completed ? "line-through" : ""}`}>{todo.title}</Typography>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() => handleComplete(todo._id)}
                                                    className="mr-2"
                                                />
                                                <ShinyButton
                                                    text={<FontAwesomeIcon icon={faEdit} />}
                                                    onClick={() => handleEdit(todo._id, todo.title, todo.body)}
                                                    className="cursor-pointer text-black bg-white"
                                                />
                                                <ShinyButton
                                                    text={<FontAwesomeIcon icon={faTrash} />}
                                                    onClick={() => handleDelete(todo._id)}
                                                    className="cursor-pointer bg-white text-red-600"
                                                />
                                            </div>
                                        </div>
                                        <Typography variant="body1" className={todo.completed ? "line-through" : ""}>{todo.body}</Typography>
                                    </div>
                                    {editTodoId === todo._id && (
                                        <div className="flex flex-col space-y-3 mt-3">
                                            <Label htmlFor="updateTitle">Update Title</Label>
                                            <Input
                                                id="updateTitle"
                                                placeholder="Update Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="mb-2 text-black"
                                            />
                                            <Label htmlFor="updateBody">Update Body</Label>
                                            <Input
                                                id="updateBody"
                                                placeholder="Update Body"
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                className="text-black"
                                            />
                                            <ShinyButton
                                                text={<FontAwesomeIcon icon={faSave} />}
                                                onClick={() => handleUpdate(todo._id)}
                                                className="text-black bg-white rounded-xl py-2 px-3"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Todo;

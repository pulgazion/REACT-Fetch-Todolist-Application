import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [buttonActive, setButtonActive] = useState(true);

  const enterKey = async (event) => {
    const newTask = { label: inputValue, done: false };
    if (event.code !== "Enter") {
      return;
    }
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch(
          "https://assets.breatheco.de/apis/fake/todos/user/pulgazion",
          {
            method: "PUT",
            body: JSON.stringify([...todos, newTask]),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setError(null);
          fetchTasks();
          setInputValue("");
        } else {
          setError(
            "Error al guardar la tarea, por favor inténtalo de nuevo"
          );
          throw new error(response.status);
        }
      } catch (error) {
        console.log("Estatus de error: ", error);
      }
    }
  };

  const deleteUser = async () => {
    try {
      setButtonActive(false);
      const response = await fetch(
        "https://assets.breatheco.de/apis/fake/todos/user/pulgazion",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        setError(
          "Error al eliminar la tarea, por favor inténtalo de nuevo"
        );
        throw new Error(response.status);
      } else {
        const userCreated = await createUser();
        if (userCreated === true) {
          await fetchTasks();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setButtonActive(true);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(
        "https://assets.breatheco.de/apis/fake/todos/user/pulgazion",
        {
          method: "POST",
          body: JSON.stringify([]),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://assets.breatheco.de/apis/fake/todos/user/pulgazion"
      );
      if (!response.ok) {
        throw new error(response.status);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log("Error fetching tasks: ", error);
      setError("Error al obtener las tareas, por favor inténtalo de nuevo");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>My to do list</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        <li style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                enterKey(e);
              }
            }}
            placeholder="What do you need to do?"
          />
          <i
            className="fas fa-plus"
            onClick={enterKey}
            style={{ cursor: "pointer", marginLeft: "0.5em" }}
          ></i>
        </li>
        {todos.map((item) => (
          <li key={item.label}>
            {item.label}{" "}
            <i
              className="fas fa-trash-alt delete-button"
              onClick={() => setTodos(todos.filter((t) => t.label !== item.label))}
            ></i>{" "}
          </li>
        ))}
      </ul>
      <div>
        {todos.length ? `${todos.length} tasks` : "No pending tasks, please add new ones"}
        <button
          type="button"
          onClick={() => {
            deleteUser();
            setButtonActive(false);
          }}
          className="btn btn-light"
          disabled={buttonActive ? "" : "disabled"}
          style={{ marginLeft: "30px" }}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default Home;

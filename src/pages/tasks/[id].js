import React, { useState,useEffect } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/components/Layout";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaletteIcon from "@mui/icons-material/Palette";
import styles from "../../app/Project.module.css";

const Tasks = () => {
  const [newTasks, setNewTasks] = useState([
    { id: 1, projectId: 1, task: "Work", color: "#313131", done: false,dueDateTime: null, duration: null },
    { id: 2, projectId: 2, task: "Hobbies", color: "#f96060", done: false,dueDateTime: null, duration: null  },
    { id: 3,  projectId: 3, task: "Home", color: "#FFC0CB", done: false,dueDateTime: null, duration: null   },
  ]);
  const router = useRouter();

let {id} = router.query

  const [NewTask, setNewTask] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [dueDate, setDueDate] = useState(null); // State to store selected due date
  const [dueTime, setDueTime] = useState(null); 
  const [colorPicked, setcolorPicked] = useState("");

  useEffect(() => {

    fetch(`http://localhost:5000/get_tasks?projectId=${router.query.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.tasks) {
                    const formattedTasks = data.tasks.map(task => ({
                        id: task.id,
                        projectId: task.projectId,
                        task: task.task,
                        color: task.color.replace(/"/g, ''), // Remove double quotes from color
                        done: task.done === 1 ? true : false, // Convert done value to boolean
                        dueDateTime: task.dueDateTime === "" ? null : new Date(task.dueDateTime).toISOString(), // Convert dueDateTime to ISO string or null
                        duration: task.duration
                    }));
                    setNewTasks(prevTasks => [...prevTasks, ...formattedTasks]);
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    
}, []);
  const [colors, setColors] = useState([
    "#FF5733", // Coral
    "#FFC300", // Sunflower
    "#9B59B6", // Amethyst
    "#3498DB", // Belize Hole
    "#2ECC71", // Emerald
    "#E74C3C", // Alizarin
    "#34495E", // Wet Asphalt
    "#F39C12", // Orange
    "#1ABC9C", // Turquoise
    "#8E44AD", // Wisteria
    "#16A085", // Green Sea
    "#27AE60", // Nephritis
    "#3498DB", // Peter River
    "#E67E22", // Carrot
    "#95A5A6", // Concrete
    "#D35400", // Pumpkin
    "#2980B9", // Belize Hole
    "#F1C40F", // Sunflower
    "#1ABC9C", // Turquoise
    "#D35400", // Pumpkin
  ]);

  const getRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
  };

  const handleGenerateColors = () => {
    const newColors = colors.map(() => getRandomColor());
    setColors(newColors);
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const addNewTask = (taskData) => {
    fetch('http://localhost:5000/add_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      // Handle successful addition of task
      console.log('Task added successfully:', data);
      // You might want to update the UI accordingly
    })
    .catch(error => console.error('Error adding task:', error));
  };
 const Newtask = () => {
  const dueDateTime = new Date(dueDate);
  if (dueTime) {
    const [hours, minutes] = dueTime.split(":").map(Number);
    dueDateTime.setHours(hours);
    dueDateTime.setMinutes(minutes);
  }
  const currentDate = new Date();
  const diffInMs = dueDateTime.getTime() - currentDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  const remainingHours = diffInHours % 24;
  
  let duration = "";
  if (diffInDays > 0) {
    duration += `${diffInDays} days `;
  }
  if (remainingHours > 0) {
    duration += `${remainingHours} hours `;
  }
  if (diffInMinutes > 0) {
    duration += `${diffInMinutes} minutes`;
  }

  const newTaskAdded = {
    id: newTasks.length + 1,
    task: NewTask,
    color: colorPicked,
    done: false,
    dueDateTime: dueDateTime,
    duration: duration.trim(),
    projectId:parseInt(router.query.id)
  };
  addNewTask(newTaskAdded)
  setNewTasks([...newTasks, newTaskAdded]);
  setShowPopup(false);
  setNewTask("");
  setDueDate(null)
  setcolorPicked("")
  setDueTime(null)
};
const filteredTasks = newTasks.filter(task => task.projectId === parseInt(router.query.id));

const isTaskDone = (id) => {
    setNewTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };
  return (
    <div className={styles["TasksContainer"]}>
      <Layout>
        <div className={styles["containeritems"]}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1> Welcome to listLady 👋🏻</h1>
            <button className={styles["Addbtn"]} onClick={togglePopup}>
              <AddIcon />
            </button>
          </div>
         <div className={styles["taskGrp"]}>
         {filteredTasks.map((newtask) => {
            return (
              <div
                className={styles["task"]}
                key={newtask.id}
                style={{ borderRight: "5px solid" + newtask.color }}
              >
                <div
                  onClick={() => isTaskDone(newtask.id)}
                  style={{
                    backgroundColor: newtask.done && newtask.color,
                    border: "2px solid" + newtask.color,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "6px",
                  }}
                >
                  {newtask.done && <CheckIcon style={{ color: "#fff" }} />}
                </div>
              <h3
                  style={{
                    textDecoration: newtask.done ? "line-through" : "none",
                    color: newtask.done && "#ccc",
                  }}
                >
                  {newtask.task}
                </h3>
                <div  style={{ marginLeft: "auto" }}>
                <h4 >{newtask.duration ? `In: ${newtask.duration}` : ""}</h4>
                </div>
              </div>
             
            );
          })}
         </div>
        </div>
      </Layout>
      {showPopup && (
        <div className={styles["popup-background"]}>
          <div className={styles["popup"]}>
            <div className={styles["closeBtn"]}>
              <button onClick={togglePopup}>
                {" "}
                <CloseIcon />
              </button>
            </div>
            <div className={styles["popup-inner"]}>
              <h2>Add New Project</h2>
              <div>
                <div className={styles["Inputcontainer"]}>
                  <label>Task :</label>
                  <input
                    type="text"
                    value={NewTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </div>
               
                 <div className={styles["Inputcontainer"]}>
                  <label> Due Day:</label>
                  <div className={styles["CalendarPicker"]}>
                   
                    <input
                      type="date"
                      value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDueDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
                <div className={styles["TimeInput"]}>
                  <label> Due Date:</label>
                      <input
                        type="time"
                        value={dueTime || ''}
                        onChange={(e) => setDueTime(e.target.value)}
                      />
                    </div>
                     <div className={styles["Inputcontainer"]}>
                  <label className={styles["labelcontainer"]}>
                    Task color:
                  </label>
                  <div className={styles["PickColorcontainer"]}>
                    {colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className={styles["PickColor"]}
                        style={{ backgroundColor: color }}
                        onClick={() => setcolorPicked(color)}
                      >
                        {colorPicked === color && (
                          <CheckCircleOutlineIcon className={styles["icon"]} />
                        )}
                      </div>
                    ))}
                    <button onClick={handleGenerateColors}>
                      <PaletteIcon />
                    </button>
                  </div>
                </div>
                <div className={styles["submitContainer"]}>
                  <button onClick={Newtask}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

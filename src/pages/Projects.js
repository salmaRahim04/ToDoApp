import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import Image from "next/image";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import PaletteIcon from '@mui/icons-material/Palette';
import axios from 'axios';
import styles from "../app/Project.module.css";
import Link from "next/link";

const Projects = ({projects}) => {
  console.log(projects)
  const [types, setTypes] = useState(projects);
  const [ProjectName,setProjectName] = useState('')
  const [colorPicked,setcolorPicked] = useState('')

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
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  
  const NewProject = async(color) => {
   
    try {
      const response = await axios.post('http://localhost:5000/add_project', { // Make a POST request to your Next.js API route
        context: ProjectName,
        color: colorPicked,
        numberOfTasks: 0,
      });
      // Update state with the new project received from the server
      setTypes([...types, response.data.project]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding project:', error);
      // Handle error
    }
  };
  return (
    <Layout>
      <div className={styles["container"]}>
        <div>
          <div style={{display:'flex',marginRight:'50px',justifyContent:'end'}}>
          <div className={styles["Add"]} onClick={togglePopup}>
            <Image
              src="/images/add.png"
              alt="My Image"
              width={32}
              height={32}
            />
          </div>
          </div>
          <div className={styles["projects"]}>
            {types.map((type) => {
              return (
               <Link  href={`/tasks/${type.id}`}>
                <div key={type.id} className={styles["ProContainer"]}>
                  <div
                    className={styles["inner-dot"]}
                    style={{ borderColor: type.color }}>
                    <div
                      style={{ backgroundColor: type.color }}
                      className={styles["dot"]}
                    ></div>
                  </div>
                  <h3>{type.context}</h3>
                  <div className={styles["tasks"]}>
                    {type.numberoftasks} tasks
                  </div>
                </div>
               </Link>
              );
            })}
          </div>
         
          {showPopup && (
            <div className={styles["popup-background"]}>
              <div className={styles["popup"]}>
              <div className={styles["closeBtn"]}>
              <button onClick={togglePopup} > <CloseIcon /></button>
              </div>
                <div className={styles["popup-inner"]}>
                  <h2>Add New Project</h2>
                  <div>
                    <div className={styles["Inputcontainer"]}>
                      <label>Project name</label>
                      <input type="text" value={ProjectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <div className={styles["Inputcontainer"]}>
                      <label className={styles["labelcontainer"]}>Project color</label>
                      <div className={styles["PickColorcontainer"]}>
                        {colors.slice(0, 5).map((color, index) => (
                          <div
                            key={index}
                            className={styles["PickColor"]}
                            style={{ backgroundColor: color }}
                            onClick={()=> setcolorPicked(color)}
                          >
                          {colorPicked ===color && <CheckCircleOutlineIcon className={styles["icon"]} />}
                          </div>
                        ))}
                        <button onClick={handleGenerateColors}>
                        <PaletteIcon />
                        </button>
                      </div>

                    </div>
                    <div className={styles["submitContainer"]}><button onClick={NewProject}>Save</button></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export async function getStaticProps() {
  try {
    const response = await axios.get('http://127.0.0.1:5000/get_projects');
    const projects = response.data.projects.map(project => ({
      id: project.id,
      context: project.context.replace(/"/g, ''),
      color: project.color.replace(/"/g, ''),
      numberoftasks: project.taskCount,

    }));
    return {
      props: {
        projects,
      },
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      props: {
        projects: [],
      },
    };
  }
}
export default Projects;

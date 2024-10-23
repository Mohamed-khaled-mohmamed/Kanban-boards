import { Client, Databases, ID, Query } from 'appwrite';
import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { databases } from '../appwrite/appwrite';
const globalState = createContext();

export function useGlobalState() {
  return useContext(globalState);
}

export function GlobalStateProvider(props) {
  const [newItem, setnewItem] = useState({});
  const [currentProject, setcurrentProject] = useState();
  const [prevProjectsId, setprevProjectsId] = useState();
  const [projects, setProjects] = useState([]);
  const [tasks, settasks] = useState([]);
  const [updateTask, setupdateTask] = useState([]);
  const [trackUpdate, settrackUpdate] = useState(false);
  const [trackUpdateProject, settrackUpdateProject] = useState(false);

  useEffect(() => {
    const fetchAndsaveOrUpdateProjectTasks = async () => {
      if (currentProject) {
        fetchProjectTasks(currentProject);
        saveOrUpdateProjectTasks(updateTask, prevProjectsId);
      }
    };
    fetchAndsaveOrUpdateProjectTasks();
  }, [currentProject]);

  useEffect(() => {
    if (JSON.stringify(tasks) !== JSON.stringify(updateTask)) {
    }
  }, [prevProjectsId]);

  const fetchProjects = async () => {
    try {
      const getUnsavedTask = localStorage.getItem('unsavedTask');
      const unsavedTask = getUnsavedTask ? JSON.parse(getUnsavedTask) : null;

      if (unsavedTask && unsavedTask.projectId && unsavedTask.allTasks) {
        await saveOrUpdateProjectTasks(unsavedTask.allTasks, unsavedTask.projectId);
      }

      const response = await databases.listDocuments(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECTS);

      if (response && response.documents && response.documents.length > 0) {
        const documentLength = response.documents.length - 1;

        if (unsavedTask?.projectId) {
          setcurrentProject(unsavedTask.projectId);
        } else {
          setcurrentProject((prevcurrentProject) => {
            return prevcurrentProject ? prevcurrentProject : response.documents[documentLength]?.$id;
          });
        }

        const sortedDocuments = response.documents.sort((a, b) => {
          return new Date(b.$createdAt || 0) - new Date(a.$createdAt || 0);
        });

        setProjects(sortedDocuments);
      } else {
        console.error('No documents found');
      }
    } catch (error) {
      console.error('Error fetching projects:');
    }
  };

  const handleAddProject = async (projectName) => {
    if (!projectName.trim()) {
      alert('Please enter a project name.');
      return;
    }

    try {
      const id = ID.unique();
      const response = await databases.createDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECTS, id, {
        projectName: projectName,
        taskId: id,
        id: id,
      });

      setnewItem({ projectName, id: id });

      setcurrentProject((prevcurrentProject) => {
        setprevProjectsId(prevcurrentProject);
        return id;
      });
    } catch (error) {
      console.error('Error adding project:');
      alert('Failed to add project.');
    }
  };

  const updateProjectsList = () => {
    if (newItem.id) {
      setProjects((prevProjects) => {
        return [newItem, ...prevProjects];
      });

      setcurrentProject((prevcurrentProject) => {
        setprevProjectsId(prevcurrentProject);
        return newItem.id;
      });
    }
  };

  const updateProject = async (ProjectId, newName) => {
    try {
      const response = await databases.updateDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECTS, ProjectId, { projectName: newName });

      settrackUpdateProject(!trackUpdateProject);
    } catch (error) {
      console.error('Error updating project:');
    }
  };

  const DeleteProject = async (ProjectId) => {
    const response = await databases.deleteDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECTS, ProjectId);
    DeleteTasksByProjectId(ProjectId);
    settrackUpdateProject(!trackUpdateProject);
    setcurrentProject(null);
    setprevProjectsId(null);
  };

  const fetchProjectTasks = async (projectId) => {
    try {
      const response = await databases.listDocuments(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, [Query.equal('projectId', projectId)]);

      if (response.documents[0]?.projectTask) {
        const tasks = JSON.parse(response?.documents[0]?.projectTask);
        settasks(tasks);
        setupdateTask(tasks);
        return tasks;
      } else {
        settasks([]);
        return tasks;
      }
    } catch (error) {
      console.error('Error fetching tasks:');
      return [];
    }
  };

  const saveProjectTasks = async (projectId, tasks) => {
    try {
      const tasksString = JSON.stringify(tasks);

      await databases.createDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, ID.unique(), {
        projectTask: tasksString,
        projectId,
      });
    } catch (error) {
      console.error('Error saving tasks:');
    }
  };

  const updateProjectTasks = async (projectId, updatedTasks) => {
    try {
      const updatedTasksString = JSON.stringify(updatedTasks);

      await databases.updateDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, projectId, {
        projectTask: updatedTasksString,
      });
    } catch (error) {
      console.error('Error updating tasks:');
    }
  };

  const saveOrUpdateProjectTasks = async (tasks, id) => {
    try {
      const uniqTasks = tasks.filter((task) => task?.savePosition == null).filter((task) => task.projectId === id);

      const tasksString = JSON.stringify(uniqTasks);

      const documents = await databases.listDocuments(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, [Query.equal('projectId', id)]);

      if (documents.total === 0) {
        const Id = ID.unique();
        await databases.createDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, ID.unique(), {
          projectTask: tasksString,
          projectId: id,
        });
      } else {
        const documentId = documents.documents[0].$id;

        await databases.updateDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, documentId, {
          projectTask: tasksString,
        });
      }
    } catch (error) {
      console.error('Error saving or updating tasks:');
    }
  };

  const DeleteTasksByProjectId = async (projectId) => {
    try {
      const response = await databases.listDocuments(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, [`equal("projectId", "${projectId}")`]);

      if (response.documents.length > 0) {
        for (const task of response.documents) {
          await databases.deleteDocument(import.meta.env.VITE_DATABASE, import.meta.env.VITE_PROJECT_TASKS, task.$id);
        }
      } else {
      }
    } catch (error) {
      console.error('Error deleting tasks:');
    }
  };

  return (
    <globalState.Provider
      value={{
        setupdateTask,
        fetchProjectTasks,
        setprevProjectsId,

        updateProjectTasks,
        saveProjectTasks,

        trackUpdate,
        updateTask,
        settrackUpdate,
        updateProject,
        DeleteProject,

        trackUpdateProject,

        fetchProjects,
        updateProjectsList,
        handleAddProject,
        newItem,
        setnewItem,
        currentProject,
        setcurrentProject,
        projects,
        setProjects,
        tasks,
      }}
    >
      {props.children}
    </globalState.Provider>
  );
}

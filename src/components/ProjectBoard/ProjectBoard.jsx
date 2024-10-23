import { useEffect } from 'react';
import { useState } from 'react';
import { useGlobalState } from '../../lib/context/globalState';
import TaskModal from '../ui/TaskModal';
import EditDeleteModel from '../Sidebar/EditDeleteModel';

import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo } from 'react';
import SortableItem from './SortableItem';
import { Client, Databases, Query } from 'appwrite';
import { CSS } from '@dnd-kit/utilities';
import { useCallback } from 'react';

const fixedStatuses = ['To Do', 'In Progress', 'Done'];

function ProjectBoard() {
  const globalState = useGlobalState();
  const [activeId, setActiveId] = useState(null);

  const [openModel, setopenModel] = useState({ state: false, id: null });

  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const uniqTask = allTasks.filter((task) => task.projectId === globalState.currentProject);
    const unsavedTask = {
      allTasks: uniqTask,
      projectId: globalState.currentProject,
    };
    localStorage.setItem('unsavedTask', JSON.stringify(unsavedTask));

    globalState.setupdateTask(uniqTask);
  }, [allTasks]);

  useEffect(() => {
    setAllTasks(globalState.tasks);
  }, [globalState.tasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      setopenModel((prevState) => false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handelEditDeleteModel(e, taskId) {
    e.stopPropagation();

    setopenModel((prevState) => ({
      state: !prevState.state,
      id: taskId,
    }));
  }

  async function handleDeleteTask(Id) {
    const index = allTasks.findIndex((task) => task.taskId === Id);
    const updateallTasks = [...allTasks];
    updateallTasks.splice(index, 1);
    setAllTasks(updateallTasks);
  }

  async function handleUpdateTask(Id, newTaskTitle) {
    const index = allTasks.findIndex((task) => task.taskId === Id);
    const updateallTasks = [...allTasks];
    updateallTasks[index].title = newTaskTitle;

    setAllTasks(updateallTasks);
  }

  function getUniqStatus(tasks, name = null) {
    const statusName = tasks
      .map((task) => {
        if (task.status == name) {
          return task.status;
        }
      })
      .filter((task) => task);
    const status = tasks.map((task) => {
      return task.status;
    });

    const uniqStatus = [...new Set(status)];
    const uniqStatusName = [...new Set(statusName)];

    if (name) {
      return uniqStatusName;
    } else {
      return uniqStatus;
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    let oldIndex = null;
    let newIndex = null;

    let oldColumn = active.data.current.sortable;
    let newColumn = over.data.current.sortable;
    if (active.id !== over.id) {
      allTasks.forEach((task, index) => {
        if (oldIndex === null && task.taskId === active.id) {
          oldIndex = index;
        }
        if (newIndex === null && task.taskId === over.id) {
          newIndex = index;
        }
      });

      if (oldIndex !== null && newIndex !== null && oldColumn.containerId === newColumn.containerId) {
        const updatedTasks = [...allTasks];
        const [movedTask] = updatedTasks.splice(oldIndex, 1);

        updatedTasks.splice(newIndex, 0, movedTask);
        setActiveId(null);
        setAllTasks(updatedTasks);
      } else if (oldIndex !== null && newIndex !== null && oldColumn.containerId !== newColumn.containerId) {
        const updatedTasks = [...allTasks];

        if (fixedStatuses.includes(oldColumn.items[0].status) && oldColumn.items.length == 1) {
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          updatedTasks.splice(oldIndex, 0, {
            projectId: globalState.currentProject,
            taskId: self.crypto.randomUUID(),
            savePosition: true,
            status: oldColumn.items[0].status,
          });

          const newColumnName = newColumn.items[0].status;
          movedTask.status = newColumnName;
          updatedTasks.splice(newIndex, 0, movedTask);
        } else {
          const [movedTask] = updatedTasks.splice(oldIndex, 1);
          const newColumnName = newColumn.items[0].status;
          movedTask.status = newColumnName;
          updatedTasks.splice(newIndex, 0, movedTask);
        }
        setActiveId(null);

        setAllTasks(updatedTasks);
      }
    }
  }

  function generateRandomColor() {
    let randomColor;

    do {
      randomColor = Math.floor(Math.random() * 16777215).toString(16);

      randomColor = randomColor.padStart(6, '0');
    } while (randomColor === 'ffffff' || randomColor === '000000');

    return `#${randomColor}`;
  }

  const renderColumn = (columnName) => {
    const createAndAddEmptyTask = () => {
      const emptyTask = {
        projectId: globalState.currentProject,
        taskId: self.crypto.randomUUID(),
        savePosition: true,
        status: columnName,
      };

      setAllTasks((prev) => [...prev, emptyTask]);
      return emptyTask;
    };

    const taskColumn = allTasks.filter((task) => task?.projectId === globalState.currentProject && task?.status === columnName);

    return (
      <div className="flex flex-col bg-[#F5F5F5] min-w-80 rounded-lg p-4 shadow-sm h-[500px] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b-4 sticky top-0 bg-[#F5F5F5] z-10" style={{ borderColor: generateRandomColor() }}>
          <h3 className="text-xl font-bold">{columnName}</h3>
          <TaskModal taskStatus={columnName} addTask={setAllTasks} setActiveId={setActiveId} />
        </div>

        {/* Content */}
        <div className="  pr-2">
          <div className="space-y-4 w-full">
            {fixedStatuses.includes(columnName) ? (
              <SortableContext items={taskColumn.length > 0 ? taskColumn : [createAndAddEmptyTask()]}>
                {taskColumn.length
                  ? taskColumn.map((task) => (
                      <SortableItem key={task.taskId} id={task.taskId}>
                        {renderTask(task)}
                      </SortableItem>
                    ))
                  : (() => {
                      const emptyTask = createAndAddEmptyTask();
                      return (
                        <SortableItem key={emptyTask.taskId} id={emptyTask.taskId}>
                          {renderTask(emptyTask)}
                        </SortableItem>
                      );
                    })()}
              </SortableContext>
            ) : (
              getUniqStatus(allTasks, columnName).map((status) => (
                <SortableContext key={status} items={allTasks.filter((task) => task.status === status)}>
                  {allTasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <SortableItem key={task.taskId} id={task.taskId}>
                        {renderTask(task)}
                      </SortableItem>
                    ))}
                </SortableContext>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTask = useCallback(
    (task) => {
      function priorityColor(priority) {
        if (priority == 'High') {
          return ' bg-red-200 text-red-700';
        } else {
          return 'bg-yellow-200 text-yellow-700';
        }
      }
      return (
        <>
          {task?.savePosition ? null : (
            <div
              className=" p-4 rounded-lg shadow-md bg-white flex justify-between items-start transition-all"
              style={{
                transform: CSS.Transform.toString(task?.transform),
                transition: 'transform 0.3s ease',
              }}
            >
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${task?.priority === 'Low' ? 'bg-green-200 text-green-700' : priorityColor(task?.priority)}`}>{task?.priority}</span>
                <h4 className="text-lg font-semibold mt-2">{task?.title}</h4>
                <p className="text-gray-600 text-sm">{task?.description}</p>
              </div>
              {/* تعديل موضع الزر والقائمة المنسدلة */}
              <div className="relative">
                <button onClick={(e) => handelEditDeleteModel(e, task.taskId)} className="text-gray-600 p-2 rounded-lg transition">
                  ...
                </button>
                {/* تعديل موضع EditDeleteModel */}
                {openModel.state && openModel.id === task?.taskId && (
                  <div className="absolute right-0  top-full mt-1 z-50">
                    <EditDeleteModel deleteItem={() => handleDeleteTask(task.taskId)} editItem={(newTaskName) => handleUpdateTask(task.taskId, newTaskName)} />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      );
    },
    [openModel, handelEditDeleteModel, handleDeleteTask, handleUpdateTask]
  );

  const columns = useMemo(() => [...fixedStatuses, ...getUniqStatus(allTasks).filter((status) => !fixedStatuses.includes(status))], [allTasks, getUniqStatus]);

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-8 p-8  overflow-x-auto h-screen">
          {globalState.currentProject ? (
            <>
              {columns.map(renderColumn)}
              <button className=" min-w-80  max-h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                <TaskModal addTask={setAllTasks} /> New Column
              </button>
            </>
          ) : (
            ' '
          )}
        </div>
        <DragOverlay>{activeId ? renderTask(allTasks.find((task) => task.taskId === activeId)) : null}</DragOverlay>
      </DndContext>
    </>
  );
}

export default ProjectBoard;

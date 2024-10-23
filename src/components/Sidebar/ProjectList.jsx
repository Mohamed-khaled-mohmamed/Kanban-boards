import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../lib/context/globalState';
import EditDeleteModel from './EditDeleteModel';
import { Menu } from 'lucide-react';

function ProjectList() {
  const [loading, setLoading] = useState(true); // حالة التحميل
  const globalState = useGlobalState();
  const [openModel, setopenModel] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handelClick(id) {
    //

    globalState.setcurrentProject((prevcurrentProject) => {
      globalState.setprevProjectsId(prevcurrentProject);
      return id;
    });
    setopenModel(false);
    setTimeout(() => {
      setMenuOpen(false);
    }, 300);
  }

  function handelEditDeleteModel(e) {
    e.stopPropagation();
    setopenModel(!openModel);
    // return <EditDeleteModel/>;
  }

  // جلب المشاريع من قاعدة البيانات
  useEffect(() => {
    generateRandomColor(16, 777, 215);
    globalState.fetchProjects();
  }, [globalState.trackUpdateProject]);

  useEffect(() => {
    if (globalState.newItem) {
      globalState.updateProjectsList();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [globalState.newItem]);

  function deleteProject() {
    globalState.DeleteProject(globalState.currentProject);
  }
  function updateProject(newName) {
    globalState.updateProject(globalState.currentProject, newName);
  }

  function getProjectColor(projectId) {
    // استرجاع الألوان من localStorage
    const savedColors = JSON.parse(localStorage.getItem('projects-color')) || {};

    // تحقق إذا كان اللون موجودًا في الألوان المسترجعة
    if (savedColors[projectId]) {
      return savedColors[projectId]; // إذا كان اللون موجودًا، نعيده
    } else {
      // إذا لم يكن موجودًا، نولّد لونًا جديدًا ونخزّنه
      const randomColor = generateRandomColor();
      savedColors[projectId] = randomColor; // إضافة اللون الجديد للكائن
      localStorage.setItem('projects-color', JSON.stringify(savedColors)); // حفظ الألوان في localStorage
      return randomColor; // إرجاع اللون الجديد
    }
  }

  function generateRandomColor() {
    let randomColor;

    do {
      // توليد لون عشوائي
      randomColor = Math.floor(Math.random() * 16777215).toString(16);
      // إضافة صفر في البداية إذا كان اللون أقل من 6 خانات
      randomColor = randomColor.padStart(6, '0');
    } while (randomColor === 'ffffff' || randomColor === '000000'); // تحقق من أن اللون ليس أبيض أو أي لون غير مرغوب فيه

    return `#${randomColor}`; // إرجاع اللون بصيغة HEX
  }

  if (loading) {
    return <p>Loading projects...</p>; // رسالة انتظار أثناء تحميل المشاريع
  }

  return (
    <div className="relative">
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`
        ${menuOpen ? 'block' : 'hidden'} 
        md:block 
        absolute md:relative 
        top-0 left-0 
        w-full md:w-auto 
        bg-white md:bg-transparent 
        shadow-lg md:shadow-none 
        z-50 md:z-auto
      `}
      >
        <ul className="py-2  ">
          {globalState.projects.map((project) => (
            <li key={project.id} className="px-4 md:px-0">
              <div
                onClick={() => handelClick(project.id)}
                className={`
                  flex items-center space-x-2 p-2 rounded-lg cursor-pointer
                  ${globalState.currentProject === project.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}
                `}
              >
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getProjectColor(project.id) }}></div>
                </div>
                <div className="flex-grow">
                  <h3 className={`font-medium ${globalState.currentProject === project.id ? 'text-indigo-700' : 'text-gray-700'}`}>{project.projectName}</h3>
                </div>
                {globalState.currentProject === project.id && (
                  <div className="flex-shrink-0 relative">
                    <button onClick={handelEditDeleteModel} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                      ...
                    </button>

                    {openModel && (
                      <div className="absolute right-0  top-full mt-1 z-50">
                        <EditDeleteModel deleteItem={() => deleteProject(project.id)} editItem={(newName) => updateProject(newName)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ProjectList;

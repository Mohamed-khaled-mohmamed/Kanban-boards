import { useEffect } from 'react';
import { useGlobalState } from '../../lib/context/globalState';
import { useState } from 'react';
import ProjectModel from '../ui/ProjectModel';

function Header() {
  const globalState = useGlobalState();
  const [openModel, setopenModel] = useState(false);
  const [projectName, setProjectName] = useState();
  useEffect(() => {
    getProjectName();
  }, [globalState.currentProject]);

  function getProjectName() {
    const project = globalState.projects.filter((project) => project.id === globalState.currentProject);
    // return project[0]?.projectName;
    setProjectName(project[0]?.projectName);
  }

  function handleEdit(newName) {
    globalState.updateProject(globalState.currentProject, newName);
  }
  function handelEditDeleteModel(e) {
    e.stopPropagation();
    setopenModel(!openModel);
    // return <EditDeleteModel/>;
  }
  function dialogOpen() {
    return (
      <svg className="mt-6 cursor-pointer" width="41" height="41" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.3893 28.4008H18.95C25.2506 28.4008 27.7709 25.9065 27.7709 19.6708V12.1878C27.7709 5.95207 25.2506 3.45776 18.95 3.45776H11.3893C5.08872 3.45776 2.56848 5.95207 2.56848 12.1878V19.6708C2.56848 25.9065 5.08872 28.4008 11.3893 28.4008Z"
          fill="#5030E5"
          fillOpacity="0.2"
        />
        <path
          d="M16.3163 10.7412L9.77632 17.2139C9.52429 17.4633 9.28488 17.9497 9.23447 18.2989L8.88164 20.7683C8.75563 21.6662 9.38568 22.2898 10.293 22.1651L12.788 21.8159C13.1408 21.766 13.6323 21.529 13.8843 21.2796L20.4243 14.8069C21.5458 13.6969 22.0877 12.3999 20.4243 10.7536C18.761 9.09492 17.4504 9.61873 16.3163 10.7412Z"
          stroke="#5030E5"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15.3839 11.6641C15.9384 13.6221 17.4883 15.1686 19.4793 15.7173" stroke="#5030E5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    );
  }
  return (
    <div className="flex text-5xl h-28 border-b-2 justify-center items-center ">
      {projectName}
      <ProjectModel projectName={projectName} setProjectName={setProjectName} dialogTrigger={dialogOpen()} handleClick={() => handleEdit(projectName)} variant={'Edit'} btnClassName={'w-10 ml-5'} />
    </div>
  );
}

export default Header;

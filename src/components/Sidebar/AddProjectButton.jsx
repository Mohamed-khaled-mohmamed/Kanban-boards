import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import ProjectModel from '@/components/ui/ProjectModel';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useGlobalState } from '../../lib/context/globalState';

function AddProjectButton({ setnewItem }) {
  const globalState = useGlobalState();
  const [projectName, setProjectName] = useState(''); // استخدام useState لتخزين اسم المشروع
  const handleClick = () => {
    globalState.handleAddProject(projectName);
  };

  return (
    <div className="flex justify-between items-center mt-3 mb-8">
      <h4 className="uppercase text-[#787486] font-bold text-[12px]">my projects</h4>
      <ProjectModel projectName={projectName} setProjectName={setProjectName} handleClick={handleClick} dialogTrigger={'+'} variant={'add'} />
    </div>
  );
}

export default AddProjectButton;

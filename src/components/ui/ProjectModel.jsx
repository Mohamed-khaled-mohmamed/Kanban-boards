import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
/**
 * Description
 * @param {any} {projectName
 * @param {any} setProjectName
 * @param {any} handleClick
 * @param {any} dialogTrigger
 * @param {any} variant}
 * @returns {any}
 */

function ProjectModel({ projectName, setProjectName, handleClick, dialogTrigger, variant, btnClassName = null }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`${
            btnClassName
              ? btnClassName
              : 'mr-8 flex justify-center items-center text-gray-500 w-8 h-8 bg-gray-200 hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-gray-300 rounded-md shadow-md'
          }`}
        >
          {dialogTrigger}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-lg p-6 shadow-lg max-w-lg">
        <DialogClose asChild>
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 bg-transparent border-none">
            <X size={24} />
          </button>
        </DialogClose>
        <DialogTitle className="mt-5 text-xl font-bold text-gray-900">{`${variant === 'add' ? 'Add New Project' : 'Edit Project'}`}</DialogTitle>
        {/* <DialogDescription className="text-sm text-gray-600 mt-2 mb-4">
        {`${variant === 'add' ? 'Add New Project' : 'Edit Project'}`}
          Enter the details for your new project.</DialogDescription> */}

        {/* إدخال اسم المشروع */}
        <input
          type="text"
          placeholder={`${variant === 'add' ? 'Project Name' : 'Edit Project'}`}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border border-gray-300 p-3 rounded-md w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* زر إضافة المشروع */}
        <DialogClose asChild>
          <button onClick={handleClick} className="mt-4 p-2 bg-blue-600 text-white rounded-md w-full hover:bg-blue-700 transition duration-300">
            {`${variant === 'add' ? 'Add Project' : 'Edit Project'}`}
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectModel;

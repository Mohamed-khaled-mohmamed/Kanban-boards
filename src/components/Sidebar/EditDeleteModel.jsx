import React from 'react';
import ProjectModel from '../ui/ProjectModel';
import { useGlobalState } from '../../lib/context/globalState';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

function EditDeleteModel({ deleteItem, editItem }) {
  const globalState = useGlobalState();
  const [projectName, setProjectName] = useState(''); // استخدام useState لتخزين اسم المشروع

  const handleEdit = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للأب
    // globalState.handleAddProject(projectName);
    // e.preventDefault();

    editItem(projectName);
  };

  const handleDeleted = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للأب

    deleteItem();
  };

  return (
    <div className="relative mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ">
      <ul className="py-1">
        <li
          className="hover:bg-gray-100 cursor-pointer px-4 py-2 text-gray-700"
          onClick={(e) => e.stopPropagation()} // إضافة stopPropagation للعنصر
        >
          <ProjectModel projectName={projectName} setProjectName={setProjectName} handleClick={handleEdit} dialogTrigger={'Edit'} variant={'Edit'} btnClassName={'w-full '} />
        </li>
        <li
          className="hover:bg-gray-100 cursor-pointer px-4 py-2 text-gray-700"
          onClick={(e) => e.stopPropagation()} // منع انتشار الحدث عند النقر على "Delete"
        >
          <AlertDialog>
            <AlertDialogTrigger className="w-full">Delete</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete your project and remove your data from our servers.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleted}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </li>
      </ul>
    </div>
  );
}

export default EditDeleteModel;

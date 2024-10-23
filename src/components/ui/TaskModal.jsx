import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useGlobalState } from '../../lib/context/globalState';
import { ID } from 'appwrite';

export default function TaskModal({ taskStatus = null, addTask }) {
  const globalState = useGlobalState();

  // استخدم useState لتحديث القيم المحلية
  const [status, setstatus] = useState();
  const [taskTitle, setTaskTitle] = useState('title');
  const [taskPriority, setTaskPriority] = useState('Low');
  const [isTitleValid, setIsTitleValid] = useState(true); // حالة الفاليديشن
  // دالة للتحقق من صحة عنوان المهمة
  const validateTaskTitle = () => {
    return taskTitle.trim() !== ''; // التحقق من أن الاسم غير فارغ
  };

  // دالة لمعالجة إضافة المشروع
  const handleClick = () => {
    // التحقق من صحة اسم المهمة
    if (!validateTaskTitle()) {
      setIsTitleValid(false); // إذا كان غير صالح، تغيير حالة الفاليديشن
      return;
    }

    let passStatus = taskStatus ? taskStatus : status;
    // إذا كان الاسم صالحًا، إضافة المهمة
    // globalState.handleAddTasks(taskTitle, taskPriority, passStatus, null);
    addTask( (prevTasks) => {
      console.log([...prevTasks, { projectId: globalState.currentProject, taskTitle, taskPriority, passStatus, attachment: null, taskId: ID.unique() }]);

      return [...prevTasks, { projectId: globalState.currentProject, title: taskTitle, priority: taskPriority, status: passStatus, attachment: null, taskId: ID.unique() }];
    });

    // إعادة تعيين حالة الفاليديشن
    setIsTitleValid(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" flex justify-center items-center text-gray-500 w-5 h-5 bg-gray-200 hover:bg-blue-600 hover:text-white transition duration-300 border-2 border-gray-300 rounded-md shadow-md">
          +
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-lg p-6 shadow-lg max-w-lg">
        <DialogClose asChild>
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 bg-transparent border-none">
            <X size={24} />
          </button>
        </DialogClose>

        <DialogTitle className="mt-5 text-xl font-bold text-gray-900">Add New Project</DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mt-2 mb-4">Enter the details for your new project.</DialogDescription>

        {/* إدخال اسم المشروع */}
        {taskStatus ? (
          // setstatus(taskStatus)
          ''
        ) : (
          <input
            type="text"
            placeholder="status Name"
            // value={status}
            onChange={(e) => {
              setstatus(e.target.value);
              if (e.target.value.trim() !== '') {
                setIsTitleValid(true); // إعادة ضبط حالة الفاليديشن عند إدخال نص
              }
            }}
            className={`border p-3 rounded-md w-full mt-2 focus:outline-none focus:ring-2 ${validateTaskTitle() ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'}`} // تغيير لون الإطار عند وجود خطأ
          />
        )}

        <input
          type="text"
          placeholder="Project Name"
          value={taskTitle}
          onChange={(e) => {
            setTaskTitle(e.target.value);
            if (e.target.value.trim() !== '') {
              setIsTitleValid(true); // إعادة ضبط حالة الفاليديشن عند إدخال نص
            }
          }}
          className={`border p-3 rounded-md w-full mt-2 focus:outline-none focus:ring-2 ${validateTaskTitle() ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'}`} // تغيير لون الإطار عند وجود خطأ
        />

        {/* تحديد الأولوية */}
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          className="border border-gray-300 p-3 rounded-md w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* زر إضافة المشروع */}
        <DialogClose asChild>
          <button
            disabled={!validateTaskTitle()}
            onClick={() => {
              if (validateTaskTitle()) {
                return handleClick();
              } else {
                return;
              }
            }}
            className={` mt-4 p-2  text-white rounded-md w-full  transition duration-300 ${validateTaskTitle() ? 'bg-blue-600 hover:bg-blue-700' : '  bg-gray-600 cursor-not-allowed'}`}
          >
            Add task
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
